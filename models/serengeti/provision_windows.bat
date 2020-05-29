

REM 1. install conda from https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe
REM 2. open powershell with conda env (should be available in start menu)

REM 3. Install dependecies:
conda create -n serengeti python=3.6
conda activate serengeti

conda install pytorch torchvision cpuonly -c pytorch
conda install -c fastai fastai
conda install -c conda-forge pyinstaller exifread

REM 4. build the bundle: Run release_model_win10_x86_64.bat from main repo dir
REM If you run into issues with loading dependecies, set a shorter $env:PATH with only system paths and conda, and re-activate the environment (Windows has trouble loading packages if $PATH after activating the environment is too long ¯\_(ツ)_/¯)

REM Now your model runner is in win10\main\main.exe - distribute the entire folder
REM Run it with: main.exe --model=.\model\trained_model.pkl --input_folder=images_fun_examples --output=output.csv --keep_scores --overwrite --pytorch_num_workers=0
REM Warning: this needs to be run from the win10\main directory for Pytorch to locate the necessary source files.
