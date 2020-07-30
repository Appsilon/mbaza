# This script extracts image frames from camera trap videos
# It then copies the images to a new directory (replicating original video dir structure)
# This new image directory can then be classified

import warnings

import cv2 # might not be needed here if fastai imported first

import os

from pathlib import Path

warnings.filterwarnings('ignore')

def is_video(filename):
    return filename.endswith(("avi", ".mp4", "AVI", "MP4"))

def get_videos(video_data_folder):
    videos = []
    try:
        for dirpath, dirnames, filenames in os.walk(video_data_folder):
            for filename in [f for f in filenames if is_video(f)]:
                videos.append(os.path.join(dirpath, filename))
    except Exception as e:
        print(f"Got exception {e}, double check {video_data_folder} is a folder")
    assert videos, "No videos found in the folder"
    print(f"Found {len(videos)} videos.")
    return videos

def copy_dir_tree(video_data_folder, new_image_data_folder):
    for dirpath, dirnames, filenames in os.walk(video_data_folder):
        structure = os.path.join(new_image_data_folder, os.path.relpath(dirpath, video_data_folder))
        if not os.path.isdir(structure):
            os.mkdir(structure)

def get_filename(path):
    head, tail = os.path.split(path)
    return tail or os.path.basename(head)
    
