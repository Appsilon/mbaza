from PyInstaller.utils.hooks import copy_metadata, get_package_paths

datas = [(get_package_paths('torchvision')[1], "torchvision")]
