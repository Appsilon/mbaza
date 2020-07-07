#!/usr/bin/env bash
set -e

source venv/bin/activate

pyinstaller main.py --distpath ../runner_linux \
     --noconfirm --additional-hooks-dir=hooks \
     --noupx --console --clean --hidden-import pkg_resources.py2_warn --hidden-import six

# TODO - zip entire models folder but excludin the `runner` folder (raw source files)
# zip -r model_linux_x86_64.zip linux/main
