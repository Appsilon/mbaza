import os
import time
import random
import argparse

def do_prediction(file_path):
    time.sleep(2)

def get_filenames_mock(directory):
    print("Files in the directory {}:".format(directory))
    print(os.listdir(directory))
    return ["img_{}.png".format(x) for x in random.sample(range(1, 100), 10)]

def compute_predictions_mock(directory):
    print("Will now start computing predictions for images in {} \n".format(directory))
    filenames = get_filenames_mock(directory)
    for i, filename in enumerate(filenames):
        print("{}/{} {}".format(i+1, len(filenames), "- "*15))
        print("     Now computing predictions for {}...".format(filename))

        do_prediction(file_path=os.path.join(directory+filename))

        print("     Prediction computed and saved! \n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--directory', '-d', type=str)
    args = parser.parse_args()
    compute_predictions_mock(args.directory)

if __name__ == "__main__":
    main()