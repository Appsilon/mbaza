#!/usr/bin/env bash
set -e

source venv/bin/activate

pyinstaller "$1" --distpath ../runner_linux \
prepare() {
    --noconfirm --additional-hooks-dir=hooks \
    --noupx --console --clean --hidden-import pkg_resources.py2_warn --hidden-import six
}

prepare main.py
