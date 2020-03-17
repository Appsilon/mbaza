pushd models\serengeti

pyinstaller main.py --distpath win10^
     --noconfirm --additional-hooks-dir=hooks ^
     --noupx --console
