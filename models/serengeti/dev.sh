#!/usr/bin/env bash

# Development script for PyInstaller debugging.

#1. Bundle

pyinstaller main.py --clean --noconfirm \
     --additional-hooks-dir=hooks

#2. Go into dist dir
pushd dist/main


#3. Run
 ./main ../../images_fun_examples

popd
