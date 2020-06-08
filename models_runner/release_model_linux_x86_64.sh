#!/usr/bin/env bash

source venv/bin/activate

pyinstaller main.py --distpath linux \
     --noconfirm --additional-hooks-dir=hooks \
     --noupx --console --clean --hidden-import pkg_resources.py2_warn --hidden-import six

zip -r model_linux_x86_64.zip linux/main
