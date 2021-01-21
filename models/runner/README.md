# Standalone program for running fastai/pytorch models on Windows / Linux / MacOSX

## Building on Windows

1. install conda from https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe
2. open powershell with conda env (should be available in start menu)
3. Install dependecies:

```
conda create -n mbaza python=3.6
conda activate mbaza

conda install --yes --channel pytorch pytorch==1.5.0 torchvision==0.6.0 cpuonly  
conda install --yes --channel fastai fastai==1.0.61
conda install --yes --channel conda-forge pyinstaller==3.6 exifread==2.1.2
conda install --yes --channel conda-forge opencv==4.4.0
```

4. build the bundle - go to `models/runner` and run `release_model_win10_x86_64.bat`
   If you run into issues with loading dependecies, set a shorter $env:PATH with only system paths and conda, and re-activate the environment (Windows has trouble loading packages if $PATH after activating the environment is too long ¯\\\*(ツ)\_/¯)

5. Now your model runner is in `runner_win\main\main.exe`.

6. Run it for example with: `main.exe infer_to_csv --model=..\..\serengeti\trained_model.pkl --input_folder=..\..\serengeti\images_fun_examples --output=output.csv --overwrite --pytorch_num_workers=0`
   (Warning: this needs to be run from `main.exe`'s directory for Pytorch to locate the necessary source files.)

7. Add `biomonitoring_stations.csv` to the main `models` directory. Distribute the entire `models` folder as a zip archive containing `biomonitoring_stations.csv`, `runner_win` and directories with models (e.g. `gabon` and `serengeti`). Do not include the `runner` directory as it contains source code and temporary build files. You can package this with:

```
Compress-Archive -Path .\models\runner_win\, .\models\gabon\, .\models\serengeti\, .\models\biomonitoring_stations.csv models_v002.zip
```

## Building on Linux

1. Create a virtual environment (`python3 -m venv venv`)
2. Install requirements from `requirements.txt` (`source venv/bin/activate; pip install -r requirements.txt`).
3. Run `release_model_linux_x86_64.sh`
4. Run it for example with: `./main --model=../../serengeti/trained_model.pkl --input_folder=../../serengeti/images_fun_examples --output=output.csv --overwrite`
   (Warning: this needs to be run from `main`'s directory for Pytorch to locate the necessary source files.)

## Running in dev mode directly

1. Create a virtual environment (`python3 -m venv venv`)
2. Install requirements from `requirements.txt` (`source venv/bin/activate; pip install -r requirements.txt`).
3. Run it for example with: `python3 main.py --model=../serengeti/trained_model.pkl --input_folder=../serengeti/images_fun_examples --output=output.csv --overwrite`
