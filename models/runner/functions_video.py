# This script extracts image frames from camera trap videos
# It then copies the images to a new directory (replicating original video dir structure)
# This new image directory can then be classified

import cv2

import os
from pathlib import Path
from itertools import count

from file_utils import get_all_files, is_image, is_video, basename_without_ext


def copy_dir_tree(video_data_folder, new_image_data_folder):
    """ Replicate the folder structure from video_data_folder into new_image_data_folder """
    for dirpath, dirnames, filenames in os.walk(video_data_folder):
        structure = os.path.join(new_image_data_folder, os.path.relpath(dirpath, video_data_folder))
        if not os.path.isdir(structure):
            os.mkdir(structure)


class Video:
    def __init__(self, path):
        self.video = cv2.VideoCapture(path)

    def __enter__(self):
        return self

    def __exit__(self, e_type, e_val, e_traceback):
        self.video.release()

    def get_frame(self, position_seconds):
        self.video.set(cv2.CAP_PROP_POS_MSEC, position_seconds * 1000)
        success, frame = self.video.read()
        return frame if success else None


def scale_down_image(image):
    return image  # TODO


def extract_thumbnail(input_file, output_dir):
    if is_image(input_file):
        thumbnail = cv2.imread(input_file)
    elif is_video(input_file):
        with Video(input_file) as video:
            thumbnail = video.get_frame(0)
    thumbnail = scale_down_image(thumbnail)

    name = basename_without_ext(input_file)
    output_file = os.path.join(output_dir, f"{name}.jpg")
    cv2.imwrite(output_file, thumbnail)


def extract_frames(input_file, output_dir, frame_interval):
    if not is_video(input_file):
        return
    print(f"Processing {os.path.basename(input_file)!r}... ", end="", flush=True)
    name = basename_without_ext(input_file)
    with Video(input_file) as video:
        for idx in count():
            frame = video.get_frame(idx * frame_interval)
            if frame is None:
                break
            output_file = os.path.join(output_dir, f"{name}_{idx + 1:03d}.jpg")
            cv2.imwrite(output_file, frame)
    print(f"extracted {idx} frames.")


def extract_images(args):
    copy_dir_tree(args.input_folder, args.output_folder)
    for path in get_all_files(args.input_folder):
        input_file = os.path.join(args.input_folder, path)
        output_dir = os.path.join(args.output_folder, os.path.dirname(path))
        if args.thumbnails:
            extract_thumbnail(input_file, output_dir)
        else:
            extract_frames(input_file, output_dir, args.frame_interval)
