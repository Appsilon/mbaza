pyinstaller main.py --distpath ../runner_win^
     --noconfirm --additional-hooks-dir=hooks ^
     --noupx --console --hidden-import pkg_resources.py2_warn --hidden-import six
