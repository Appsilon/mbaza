#!/usr/bin/env python3
import os
import time
import random
import argparse


def do_prediction(file_path: str):
    time.sleep(2)


def get_filenames_mock(directory: str):
    return os.listdir(directory)


def compute_predictions_mock(inpath: str, outpath: str):
    print(
        f"Will now start computing predictions for images from {inpath}, storing results in {outpath} \n"
    )
    time.sleep(2)

    filenames = get_filenames_mock(inpath)
    for i, filename in enumerate(filenames):
        print(
            "{}/{}   Now computing predictions for {}...".format(
                i + 1, len(filenames), filename
            )
        )
        do_prediction(file_path=os.path.join(inpath, filename))

    print("Predictions computed and saved! \n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--inpath", "-i", type=str)
    parser.add_argument("--outpath", "-o", type=str)
    args = parser.parse_args()
    compute_predictions_mock(args.inpath, args.outpath)


if __name__ == "__main__":
    main()
