import argparse, sys
import warnings

from functions_video import *

def main():
    parser = argparse.ArgumentParser(
        description="process_videos.py: takes videos in a given folder structure and recreates this folder structure, with images being frames extracted at a fixed time interval"
    )
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

    args = parser.parse_args()
    process_videos(args)
    sys.exit(0)

if (__name__ == "__main__"):
    main()
