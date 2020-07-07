# Standalone program for running fastai/pytorch models on Windows / Linux / MacOSX

## Building on Windows

1. install conda from https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe
2. open powershell with conda env (should be available in start menu)
3. Install dependecies:

```
conda create -n serengeti python=3.6
conda activate serengeti

conda install pytorch torchvision cpuonly -c pytorch
conda install -c fastai fastai
conda install -c conda-forge pyinstaller exifread
```

4. build the bundle - Run release*model_win10_x86_64.bat from main repo dir
   REM If you run into issues with loading dependecies, set a shorter $env:PATH with only system paths and conda, and re-activate the environment (Windows has trouble loading packages if $PATH after activating the environment is too long ¯\\*(ツ)\_/¯)

5. Now your model runner is in `runner_win\main\main.exe`. Distribute the entire `runner_win\main` folder.

6. Run it for example with: `main.exe --model=..\..\serengeti\model\trained_model.pkl --input_folder=..\..\serengeti\images_fun_examples --output=output.csv --keep_scores --overwrite --pytorch_num_workers=0`
   (Warning: this needs to be run from `main.exe`'s directory for Pytorch to locate the necessary source files.)

## Building on Linux

1. Create a virtual environment (`python3 -m venv venv`)
2. Install requirements from `requirements.txt` (`source venv/bin/activate; pip install -r requirements.txt`).
3. Run `release_model_linux_x86_64.sh`
