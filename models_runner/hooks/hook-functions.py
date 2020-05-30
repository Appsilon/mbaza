from PyInstaller.utils.hooks import copy_metadata, get_package_paths, collect_dynamic_libs

binaries = [(path, '.') for (path, _) in collect_dynamic_libs('torch')]
