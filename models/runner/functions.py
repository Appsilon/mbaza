# This script loads all images in subfolders of a specified folder and a model.
# Next it runs inference from the model on the images and saves a csv with image path, classification, possibly toop predictions and scores.

import os
from datetime import datetime

from pathlib import Path

import pandas as pd

from fastai import *
from fastai.vision import *

import exifread

N_TOP_RESULTS = 3

def is_image(filename):
    return filename.lower().endswith(("jpg", "jpeg", "png"))

def get_images(data_folder):
    images = []
    try:
        for dirpath, dirnames, filenames in os.walk(data_folder):
            for filename in [f for f in filenames if is_image(f)]:
                images.append(os.path.join(dirpath, filename))
    except Exception as e:
        print(f"Got exception {e}, double check {data_folder} is a folder")
    assert images, "No images found in the folder"
    print(f"Found {len(images)} images.")
    return images

def load_model(model, images, pytorch_num_workers):
    model_path = Path(model)
    print(f"Loading model: {model}.")
    assert model_path.exists(), f"It seems {model} is not a file"
    assert model_path.suffix == ".pkl", "The model should end with .pkl"
    learn = load_learner(model_path.parent, model_path.name, test=images, num_workers=pytorch_num_workers)
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

def get_predictions(model, images, pytorch_num_workers):
    learn = load_model(model, images, pytorch_num_workers)
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
    pattern = "Check\s([^\\/]*).*STATION_([^\\/]*).*CAM([^\\/]*)"
    result = df.copy()
    result[["check", "station", "camera"]] = result.path.str.extract(pattern)
    return result

def parse_exif(df):
    """ extract datetime, gps long and gps lat from exif of images """
    result = df.copy()

    exif_datetime = []
    exif_gps_long = []
    exif_gps_lat = []
    for path_name in result.path:
        f = open(path_name, 'rb')
        tags = exifread.process_file(f)
        if tags:
            try:
                exif_datetime.append(tags["EXIF DateTimeOriginal"].values)
            except:
                exif_datetime.append(None)
            try:
                exif_gps_long.append(tags["GPS GPSLongitude"].values)
                exif_gps_lat.append(tags["GPS GPSLatitude"].values)
            except:
                exif_gps_long.append(None)
                exif_gps_lat.append(None)
        else:
            exif_datetime.append(None)
            exif_gps_long.append(None)
            exif_gps_lat.append(None)
    result["exif_datetime"] = exif_datetime
    result["exif_gps_long"] = exif_gps_long
    result["exif_gps_lat"] = exif_gps_lat

    return result

def order_df(df,var):
    """ make the var list of columns as the first columns, keep rest at the end in df """
    if type(var) is str:
        var = [var] # handling var being a single name not a list
    varlist =[w for w in df.columns if w not in var]
    df = df[var+varlist]
    return df

def infer_to_csv(model, data_folder, output, keep_scores, overwrite, pytorch_num_workers):
    if not overwrite:
        assert not Path(output).exists(), f"{output} already exists, use the 'overwrite' option to proceed anyway."
    images = get_images(data_folder)
    preds, classes = get_predictions(model, images, pytorch_num_workers)
    df_preds = get_top_preds_and_scores(preds, classes)
    df_preds["path"] = images
    df_preds = parse_path(df_preds) # extract station, check, cam where possible from path
    df_preds = parse_exif(df_preds) # extract datetime, gps_long and gps_lat from exif if images

    result = order_df(df_preds, ["path", "station", "check", "camera",\
                                 "exif_datetime", "exif_gps_long", "exif_gps_lat",\
                                 ] + [f"{prefix}_{i}" for prefix in ["pred", "score"] for i in range(1, N_TOP_RESULTS + 1) ])
    if not keep_scores:
        result = df_preds[["path", "station", "check", "camera",\
                           "exif_datetime", "exif_gps_long", "exif_gps_lat",\
                           "pred_1"]]

    result.to_csv(output, index=False)
    print(f"Results stored in {output}.")
