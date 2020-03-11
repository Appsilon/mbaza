from PyInstaller.utils.hooks import get_package_paths, is_darwin

if is_darwin:
    datas = [(get_package_paths('torchvision')[1], "site-packages/torchvision")]
else:
    datas = [(get_package_paths('torchvision')[1], "torchvision")]
