from PyInstaller.utils.hooks import get_package_paths, is_darwin

datas = [
    (get_package_paths('torchvision')[1], "site-packages/torchvision"),
    (get_package_paths('torchvision')[1], "torchvision")]
