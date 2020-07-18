import argparse, sys

from functions import *

def main():
    parser = argparse.ArgumentParser(
        description="infer_to_csv.py: classifies images from folder structure with a model, returns csv with image path, predictions, some metadata from EXIF's"
    )
    parser.add_argument(
        "-m",
        "--model",
        required = True,
        metavar = "/path/to/model",
        help = "Path to the model .pkl file",
    )
    parser.add_argument(
        "-i",
        "--input_folder",
        required = True,
        metavar = "/path/to/folder",
        help="Path to the folder with subfolders with structure: STATION_*/Check*/CAM*/*/*.(jpg|jpeg|png)",
    )
    parser.add_argument(
        "-o",
        "--output",
        required = True,
        metavar = "/path/to/output.csv",
        help="Path to the output .csv file with results",
    )
    parser.add_argument(
        "--grid_file",
        metavar="/path/to/stations.csv",
        help="Path to a .csv file with the coordinates of monitoring stations",
    )
    parser.add_argument(
        "--overwrite",
        default = False,
        action = "store_true",
        help="Use this switch to force overwriting output file",
    )
    parser.add_argument(
        "--pytorch_num_workers",
        type = int,
        default = 16,
        help="Number of PyTorch data read workers. Set to 0 on Windows to avoid fork issues",
    )
    parser.add_argument(
        "--batch_size",
        type = int,
        default = 1,
        help="Number of images processed in one batch. Set to smaller number if facing memory issues",
    )

    args = parser.parse_args()
    infer_to_csv(args)

if (__name__ == "__main__"):
    main()
