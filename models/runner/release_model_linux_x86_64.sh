#!/usr/bin/env bash
set -e

source venv/bin/activate

prepare() {
  pyinstaller "$1" --distpath ../runner_linux \
    --noconfirm --additional-hooks-dir=hooks \
    --noupx --console --clean --hidden-import pkg_resources.py2_warn --hidden-import six
}

prepare main.py
prepare main_process_videos.py

# TODO - zip entire models folder but excludin the `runner` folder (raw source files)
# zip -r model_linux_x86_64.zip linux/main
