import argparse, sys
import warnings

from functions import infer_to_csv
from functions_video import process_videos

# Avoid flood of warnings from PyTorch
warnings.filterwarnings('ignore')

def setup_infer_parser(parser):
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

def setup_process_videos_parser(parser):
    parser.add_argument(
        "-i",
        "--input_folder",
        required = True,
        metavar = "/path/to/input/folder",
        help="Absolute path to the folder with subfolders to be replicated, e.g., with structure: Check */STATION_*/CAM*/<ddmmyy>/*.(avi|mp4)",
    )
    parser.add_argument(
        "-o",
        "--output_folder",
        required = True,
        metavar = "/path/to/output/folder",
        help="Absolute path to the folder were subfolders will be replicated and extracted frames stored",
    )
    parser.add_argument(
        "--frame_interval",
        type = float,
        default = 5.0,
        help="Time interval (in seconds) for extracting frames from videos",
    )

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(help='Choose the task to run', dest='command')

infer_to_csv_parser = subparsers.add_parser('infer_to_csv', help='infer_to_csv.py: classifies images from folder structure with a model, returns csv with image path, predictions, some metadata from EXIF\'s')
setup_infer_parser(infer_to_csv_parser)
process_videos_parser = subparsers.add_parser('process_videos', help='process_videos.py: takes videos in a given folder structure and recreates this folder structure, with images being frames extracted at a fixed time interval')
setup_process_videos_parser(process_videos_parser)

if (__name__ == "__main__"):
    args = parser.parse_args()
    print(args.command)

    if args.command == 'process_videos':
        process_videos(args)
    elif args.command == 'infer_to_csv':
        infer_to_csv(args)
    else:
        print("Unknown command %s")
        sys.exit(1)

    sys.exit(0)
