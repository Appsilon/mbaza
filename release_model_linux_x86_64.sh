#!/usr/bin/env bash

pushd models/serengeti
pyinstaller main.py --clean --noconfirm \
     --additional-hooks-dir=hooks

zip -r model_linux_x86_64.zip dist/main
