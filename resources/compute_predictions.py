import os
import time
import random
import argparse

def do_prediction(file_path):
    time.sleep(2)

def get_filenames_mock(directory):
    return os.listdir(directory)

def compute_predictions_mock(directory):
    print("Will now start computing predictions for images in {} \n".format(directory))
    time.sleep(2)

    filenames = get_filenames_mock(directory)
    for i, filename in enumerate(filenames):
        print("{}/{}   Now computing predictions for {}...".format(i+1, len(filenames), filename))
        do_prediction(file_path=os.path.join(directory+filename))

    print("Predictions computed and saved! \n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--directory', '-d', type=str)
    args = parser.parse_args()
    compute_predictions_mock(args.directory)

if __name__ == "__main__":
    main()