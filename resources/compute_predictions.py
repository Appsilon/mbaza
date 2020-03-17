#!/usr/bin/env python3
import os
import time
import random
import argparse
import csv

ANIMALS = ['timon', 'pumba', 'simba', 'nala']

def do_prediction(file_path: str):
    time.sleep(1)
    return {'path': file_path, 'result': random.choice(ANIMALS)}


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

    os.mkdir(outpath)

    with open(os.path.join(outpath, 'results.csv'), 'w') as csvfile:
        fieldnames = ['path', 'result']
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
