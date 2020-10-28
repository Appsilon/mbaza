import os
import os.path


RESOURCES_PATH = os.path.realpath(
    os.path.join(os.path.dirname(__file__), 'resources')
)


def resource_path(resource_name):
    return os.path.join(RESOURCES_PATH, resource_name)


def get_all_files(directory):
    for path, _, filenames in os.walk(directory):
        relpath = os.path.relpath(path, start=directory)
        for f in filenames:
            yield os.path.join(relpath, f)


def is_video(path):
    return path.lower().endswith((".avi", ".mp4"))


def is_image(path):
    return path.lower().endswith((".jpg", ".jpeg", ".png"))


def basename_without_ext(path):
    return os.path.splitext(os.path.basename(path))[0]
