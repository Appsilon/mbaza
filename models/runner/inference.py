# This script loads all images in subfolders of a specified folder and a model.
# Next it runs inference from the model on the images and saves a csv with image path, classification, possibly toop predictions and scores.
import os
from datetime import datetime
from pathlib import Path

import exifread
import pandas as pd
from fastai import *
from fastai.vision import *

from file_utils import get_all_files, is_image
from taxons import taxons_df


# Avoid flood of warnings from PyTorch
warnings.filterwarnings('ignore')

N_TOP_RESULTS = 3
APP_VERSION = '1.0.4'

def get_images(directory):
    images = [os.path.join(directory, f) for f in get_all_files(directory) if is_image(f)]
    print(f"Found {len(images)} images")
    return images

def load_model(model, images, pytorch_num_workers, batch_size):
    model_path = Path(model)
    print(f"Loading model: {model}.")
    assert model_path.exists(), f"It seems {model} is not a file"
    assert model_path.suffix == ".pkl", "The model should end with .pkl"
    learn = load_learner(model_path.parent, model_path.name, test=images, num_workers=pytorch_num_workers)
    learn.data.batch_size = batch_size
    # learn.callback_fns=[]
    print(f"Model loaded.")
    return learn

def get_gpu_status(learn):
    if torch.cuda.device_count() > 0:
        print("GPU available.")
        try:
            learn.model = model.cuda()
            print("Using GPU for inference.")
        except:
            print("Unable to use GPU, using CPU.")
    else:
        print("No GPU detected.")

def run_inference(learn):
    inference_start = datetime.now()
    print(f"Starting inference. time={inference_start}")
    preds,y = learn.get_preds(ds_type=DatasetType.Test)
    inference_stop = datetime.now()
    print(f"Inference complete. It took {inference_stop - inference_start}.")
    return preds

def get_predictions(model, images, pytorch_num_workers, batch_size):
    learn = load_model(model, images, pytorch_num_workers, batch_size)
    get_gpu_status(learn)
    preds = run_inference(learn)
    classes = learn.data.classes
    preds = pd.DataFrame(
            np.stack(preds),
            columns=classes,
        )
    return preds, classes

def get_top_preds_and_scores(preds, classes):
    df_preds = preds.copy()
    ranks = df_preds.rank(axis=1,method='dense', ascending=False).astype(int)

    for i in range(1, N_TOP_RESULTS + 1):
        df_preds[f"pred_{i}"] = pd.Series(ranks.where(ranks==i).notnull().values.nonzero()[1]).apply(lambda x: classes[x])
        df_preds[f"score_{i}"] = df_preds.apply(lambda x: x[x[f"pred_{i}"]], axis=1)

    return df_preds

def parse_path(df):
    """ extract station, check and cam from path column and store. """
    pattern = r"Check\s(\d*).*STATION_(\d*).*CAM(\d*).*[\\/](\d{6})[\\/]"
    result = df.copy()
    result[["check", "station", "camera", "path_date"]] = result.location.str.extract(pattern)
    result["station"] = pd.to_numeric(result["station"])
    result["path_date"] = pd.to_datetime(result["path_date"], format="%m%d%y").map(lambda x: x.date())
    return result

def read_exif_coords(tags):
    """Read GPS coordinates from Exif tags and return longitude, latitude tuple"""
    def get_coord(ref, coord):
        ref = {"N": 1, "S": -1, "W": -1, "E": 1}[ref.values]
        degrees, minutes, seconds = (v.num / v.den for v in coord.values)
        return ref * (degrees + minutes / 60 + seconds / 3600)

    try:
        long = get_coord(tags["GPS GPSLongitudeRef"], tags["GPS GPSLongitude"])
        lat = get_coord(tags["GPS GPSLatitudeRef"], tags["GPS GPSLatitude"])
        return long, lat
    except KeyError:
        return None, None

def parse_exif(df):
    """ extract datetime, gps long and gps lat from exif of images """
    result = df.copy()

    exif_datetime = []
    exif_gps_long = []
    exif_gps_lat = []
    for path_name in result.location:
        f = open(path_name, 'rb')
        tags = exifread.process_file(f)
        if tags:
            try:
                exif_datetime.append(tags["EXIF DateTimeOriginal"].values)
            except KeyError:
                exif_datetime.append(None)
            long, lat = read_exif_coords(tags)
            exif_gps_long.append(long)
            exif_gps_lat.append(lat)
        else:
            exif_datetime.append(None)
            exif_gps_long.append(None)
            exif_gps_lat.append(None)
    exif_datetime = pd.to_datetime(exif_datetime, format="%Y:%m:%d %H:%M:%S")
    result["exif_date"] = exif_datetime.map(lambda x: x.date() if pd.notna(x) else x)
    result["exif_time"] = exif_datetime.map(lambda x: x.time() if pd.notna(x) else x)
    result["exif_gps_long"] = exif_gps_long
    result["exif_gps_lat"] = exif_gps_lat

    return result

def add_station_coords(df, grid_file):
    """Add station coordinates matched from the grid file"""
    # Grid file column name --> output column name mapping.
    columns = {
        "locationID": "station",
        "Longitude": "grid_file_long",
        "Latitude": "grid_file_lat",
    }
    if grid_file is None:
        # Use empty data frame - as if the grid file had no stations.
        stations = pd.DataFrame(columns=columns.values())
    else:
        stations = pd.read_csv(grid_file)
        stations.rename(columns=columns, inplace=True, errors="raise")
    return pd.merge(df, stations, how="left", on="station")

def add_output_coords(df):
    """Add output coordinates determined on best-effort basis"""
    def f(row):
        # Prefer Exif.
        if pd.notnull(row["exif_gps_long"]) and pd.notnull(row["exif_gps_lat"]):
            long, lat = row["exif_gps_long"], row["exif_gps_lat"]
        elif pd.notnull(row["grid_file_long"]) and pd.notnull(row["grid_file_lat"]):
            long, lat = row["grid_file_long"], row["grid_file_lat"]
        else:
            long, lat = None, None
        row["coordinates_long"] = long
        row["coordinates_lat"] = lat
        return row
    return df.apply(f, axis=1)

def add_output_date(df):
    """Add output date determined on best-effort basis"""
    def f(row):
        # Prefer date extracted from path.
        if pd.notnull(row["path_date"]):
            row["date"] = row["path_date"]
        elif pd.notnull(row["exif_date"]):
            row["date"] = row["exif_date"]
        else:
            row["date"] = None
        return row
    return df.apply(f, axis=1)

def wcs_image_id(path):
    return os.path.basename(os.path.splitext(path)[0])

def wcs_timestamp(date, time):
    return date.strftime('%Y-%m-%d') + ' ' + time.strftime('%H:%M:%S')

def add_wcs_taxons(df):
    return df.merge(taxons_df(), how="left", left_on="pred_1", right_on="label")

def add_wcs_columns(df, args):
    df = df.copy()
    df["project_id"] = args.project_id
    df["deployment_id"] = args.deployment_id
    df["image_id"] = df.apply(lambda row: wcs_image_id(row["location"]), axis=1)
    df["identified_by"] = f"Mbaza-AI-{APP_VERSION}"
    df["uncertainty"] = df["score_1"]
    df["timestamp"] = df.apply(lambda row: wcs_timestamp(row["date"], row["exif_time"]), axis=1)
    df["number_of_objects"] = 1
    df["highlighted"] = ""
    df["age"] = ""
    df["sex"] = "Unknown"
    df["animal_recognizable"] = ""
    df["individual_id"] = ""
    df["individual_animal_notes"] = ""
    df["markings"] = ""
    df = add_wcs_taxons(df)
    return df

def arrange_columns(df):
    wcs_cols = [
        "project_id", "deployment_id", "image_id", "location", "identified_by",
        "wi_taxon_id", "class", "order", "family", "genus", "species", "common_name",
        "uncertainty", "timestamp", "number_of_objects", "highlighted", "age", "sex",
        "animal_recognizable", "individual_id", "individual_animal_notes", "markings",
    ]
    metadata_cols = [
        "station", "check", "camera",
        "date", "path_date", "exif_date", "exif_time",
        "coordinates_long", "coordinates_lat", "exif_gps_long", "exif_gps_lat", "grid_file_long", "grid_file_lat",
    ]
    score_cols = [f"{prefix}_{i}" for prefix in ("pred", "score") for i in range(1, N_TOP_RESULTS + 1)]

    cols = wcs_cols + metadata_cols + score_cols
    cols += [col for col in df.columns if col not in set(cols)]  # Include the remaning columns at the back
    return df[cols]

def infer_to_csv(args):
    if not args.overwrite:
        assert not Path(args.output).exists(), f"{args.output} already exists, use the 'overwrite' option to proceed anyway."
    images = get_images(args.input_folder)
    preds, classes = get_predictions(args.model, images, args.pytorch_num_workers, args.batch_size)
    df_preds = get_top_preds_and_scores(preds, classes)
    df_preds["location"] = images
    df_preds = parse_path(df_preds) # extract station, check, cam where possible from path
    df_preds = parse_exif(df_preds) # extract datetime, gps_long and gps_lat from exif if images
    df_preds = add_station_coords(df_preds, args.grid_file)
    df_preds = add_output_date(df_preds)
    df_preds = add_output_coords(df_preds)
    df_preds = add_wcs_columns(df_preds, args)
    df_preds = arrange_columns(df_preds)
    df_preds.to_csv(args.output, index=False)
    print(f"Results stored in {args.output}.")
