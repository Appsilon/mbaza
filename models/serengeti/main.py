import argparse

from functions import *


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("images_path")
    arguments = parser.parse_args()
    run_classification(images_path=arguments.images_path)

if __name__ == "__main__":
    main()
