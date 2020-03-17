

REM 1. install conda from https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe
REM 1.5 open powershell with conda env (should be available in start menu)
REM 2. create virtualenv
conda create -n serengeti python=3.6
REM 3. source env into current shell
conda activate serengeti
REM 4. install pytorch
conda install pytorch torchvision cpuonly -c pytorch
REM 5. install fastai
conda install -c fastai fastai 
REM 6. install pyinstaller
conda install -c conda-forge pyinstaller 

REM 7. build the bundle
REM Run release_model_win10_x86_64.bat from main repo dir

