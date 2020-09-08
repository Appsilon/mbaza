# This script extracts image frames from camera trap videos
# It then copies the images to a new directory (replicating original video dir structure)
# This new image directory can then be classified

import cv2

import os
from pathlib import Path

def is_video(filename):
    """ Check if filename has a supported extension """
    return filename.lower().endswith(("avi", "mp4"))

def get_videos(video_data_folder):
    """ Find videos in video_data_folder and store their relative paths """
    videos = []
    try:
        for dirpath, dirnames, filenames in os.walk(video_data_folder):
            for filename in [f for f in filenames if is_video(f)]:
                relative_dirpath = os.path.relpath(dirpath, video_data_folder)
                videos.append(os.path.join(relative_dirpath, filename))
    except Exception as e:
        print(f"Got exception {e}, double check {video_data_folder} is a folder")
    assert videos, "No videos found in the folder"
    print(f"Found {len(videos)} videos.")
    return videos

def copy_dir_tree(video_data_folder, new_image_data_folder):
    """ Replicate the folder structure from video_data_folder into new_image_data_folder """
    for dirpath, dirnames, filenames in os.walk(video_data_folder):
        structure = os.path.join(new_image_data_folder, os.path.relpath(dirpath, video_data_folder))
        if not os.path.isdir(structure):
            os.mkdir(structure)

def process_videos(args):
    # Find videos in the input folder structure
    videos = get_videos(args.input_folder)
    # Replicate directory structure
    copy_dir_tree(args.input_folder, args.output_folder)

    # Loop through videos and extract frames to new image directory
    for video in videos:
        print(f"Processing: {os.path.basename(video)}", end=" ... ", flush=True)
        # Read video
        vid = cv2.VideoCapture(os.path.join(args.input_folder, video))

        frameIndex = 0
        while(True):
            # Extract frames every frame_interval seconds
            vid.set(cv2.CAP_PROP_POS_MSEC, (frameIndex*1000*args.frame_interval))
            ret, frame = vid.read()
            # Detect end of video
            if not ret: 
                break
            # Save extracted frame
            filename_tuple = os.path.splitext(os.path.basename(video))
            frame_filename = filename_tuple[0] + "_" + filename_tuple[1][1:] + f"_{frameIndex+1:03d}.jpg"
            frame_filepath = os.path.join(args.output_folder, os.path.dirname(video), frame_filename)
            cv2.imwrite(frame_filepath, frame)

            # Next frame
            frameIndex += 1
        print(f"extracted {frameIndex} frames.")
