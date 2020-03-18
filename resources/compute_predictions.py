#!/usr/bin/env python3
import os
import time
import random
import argparse
import csv

ANIMALS = ['timon', 'pumba', 'simba', 'nala']

def do_prediction(file_path: str):
    time.sleep(1)
    return {
      'path': file_path,
      'pred_1': random.choice(ANIMALS),
      'score_1': 0.85,
      'station': "STATION_1",
      'check': "1",
      'camera': "CAM68107",
      'coords': "(coords)",
      'datetime': '2020-03-18T01:38:12.369433'
    }


def get_filenames_mock(directory: str):
    for root, dirs, files in os.walk(directory):
        for name in files:
            yield os.path.join(root, name)


def compute_predictions_mock(inpath: str, outpath: str):
    print(
        f"Will now start computing predictions for images from {inpath}, storing results in {outpath} \n"
    )
    time.sleep(2)

    filenames = list(get_filenames_mock(inpath))
    results = []
    for i, filename in enumerate(filenames):
        print(
            "{}/{}   Now computing predictions for {}...".format(
                i + 1, len(filenames), filename
            )
        )
        results.append(do_prediction(file_path=os.path.join(inpath, filename)))

    with open(outpath, 'w') as csvfile:
        fieldnames = ['path', 'station', 'check', 'camera', 'coords', 'pred_1', 'score_1']
        writer = csv.DictWriter(csvfile, fieldnames = fieldnames)
        writer.writeheader()
        for row in results:
            writer.writerow(row)


    print("Predictions computed and saved! \n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--inpath", "-i", type=str, required=True)
    parser.add_argument("--outpath", "-o", type=str, required=True)
    args = parser.parse_args()
    compute_predictions_mock(args.inpath, args.outpath)


if __name__ == "__main__":
    main()
