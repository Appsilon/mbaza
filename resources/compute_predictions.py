import os
import time
import random
import argparse

def do_prediction(file_path):
    time.sleep(2)

def get_filenames(directory):
    return ["img_{}.png".format(x) for x in random.sample(range(1, 100), 10)]

def compute_predictions(directory):
    print("Will now start computing predictions for images in {} \n".format(directory))
    file_names = get_filenames(directory)
    for i, file_name in enumerate(file_names):
        print("{}/{} {}".format(i+1, len(file_names), "- "*15))
        print("     Now computing predictions for {}...".format(file_name))

        do_prediction(file_path=os.path.join(directory+file_name))

        print("     Prediction computed and saved! \n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--directory', '-d', type=str)
    args = parser.parse_args()
    compute_predictions(args.directory)

if __name__ == "__main__":
    main()