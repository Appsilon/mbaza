import React, { useState } from 'react';
import {
  Button,
  Card,
  Elevation,
  H1,
  Intent,
  NonIdealState,
  Radio,
  RadioGroup,
  Toaster
} from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';
import { TFunction } from 'i18next';

import PythonLogViewer from '../components/PythonLogViewer';

type changeLogMessageType = (newChangeLogMessage: string | null) => void;
type changePathChoiceType = (newPath: string) => void;

const isDev = process.env.NODE_ENV === 'development';
const isWin = !isDev && process.platform === 'win32';
const isLinux = !isDev && process.platform === 'linux';

function getUserDataPath() {
  if (isDev) {
    return path.resolve('.');
  }
  // eslint-disable-next-line global-require
  const { app } = require('electron').remote;
  return app.getPath('userData');
}

const rootModelsDirectory = path.join(getUserDataPath(), 'models');

const toaster = Toaster.create({});

function displayErrorToast(message: string) {
  toaster.show({
    message,
    intent: Intent.DANGER,
    icon: 'warning-sign'
  });
}

function displayWarningToast(message: string) {
  toaster.show({
    message,
    intent: Intent.WARNING,
    icon: 'warning-sign'
  });
}

function runModelProcess(
  baseArgs: string[],
  t: TFunction
): ChildProcessWithoutNullStreams | null {
  const gridFilePath = path.join(
    rootModelsDirectory,
    'biomonitoring_stations.csv'
  );

  let workdir;
  let program;
  const args = [];

  if (isDev) {
    workdir = path.join(rootModelsDirectory, 'runner');
    program = path.join(workdir, 'venv', 'bin', 'python3');
    args.push('main.py');
  } else if (isWin) {
    workdir = path.join(rootModelsDirectory, 'runner_win', 'main');
    program = path.join(workdir, 'main.exe');
    // TODO: Determine a suitable number of workers in the classifier script.
    args.push('--pytorch_num_workers=0');
  } else if (isLinux) {
    workdir = path.join(rootModelsDirectory, 'runner_linux', 'main');
    program = path.join(workdir, 'main');
  } else {
    throw new Error(
      `Unsupported operating system for running models: ${process.platform}`
    );
  }

  if (!fs.existsSync(program)) {
    displayErrorToast(t('classify.modelExecutableNotFound', { program }));
    return null;
  }

  if (!fs.existsSync(gridFilePath)) {
    displayWarningToast(
      t('classify.biomonitoringStationsFileNotFound', { gridFilePath })
    );
  }

  args.push('--grid_file', gridFilePath);
  args.push(...baseArgs);
  return spawn(program, args, { cwd: workdir });
}

const computePredictions = (
  directory: string,
  savePath: string,
  modelName: string,
  changeLogMessage: changeLogMessageType,
  setIsRunning: (value: boolean) => void,
  setExitCode: (value: number | null | undefined) => void,
  t: TFunction
) => {
  const modelWeightsPath = path.join(
    rootModelsDirectory,
    modelName,
    'trained_model.pkl'
  );

  const args: string[] = [
    '--input_folder',
    directory,
    '--output',
    savePath,
    '--model',
    modelWeightsPath,
    '--overwrite'
  ];

  if (!fs.existsSync(modelWeightsPath)) {
    displayErrorToast(t('classify.modelWeightsNotFound', { modelWeightsPath }));
    return;
  }

  // TODO: Fix and simplify logging:
  //   * Progress bar is not properly displayed in the output (#89).
  //   * Is `changeLogMessageType` necessary?
  //   * Are Redux actions appropriate for this use case?
  const process = runModelProcess(args, t);
  if (process !== null) {
    changeLogMessage(null);
    setExitCode(undefined);
    setIsRunning(true);
    process.stdout.on('data', data => {
      changeLogMessage(`${data}`);
    });
    process.stderr.on('data', data => {
      // eslint-disable-next-line no-console
      console.log(`classifier stderr: ${data}`);
      changeLogMessage(`${data}`);
    });
    process.on('exit', exitCode => {
      // eslint-disable-next-line no-console
      console.log(`Classifier exited with code ${exitCode}`);
      setIsRunning(false);
      setExitCode(exitCode);
    });
  }
};

const chooseDirectory = (changeDirectoryChoice: changePathChoiceType) => {
  // eslint-disable-next-line global-require
  const { dialog } = require('electron').remote;
  dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then(result => {
      if (!result.canceled) {
        const directory = result.filePaths[0];
        changeDirectoryChoice(directory);
      }
      return null;
    })
    .catch(error => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
};

function chooseSavePath(changeSavePathChoice: changePathChoiceType) {
  // eslint-disable-next-line global-require
  const { dialog, app } = require('electron').remote;
  dialog
    .showSaveDialog({
      defaultPath: `${app.getPath('documents')}/classification_result.csv`,
      filters: [
        { name: 'CSV', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    .then(result => {
      if (!result.canceled) {
        changeSavePathChoice(result.filePath ? result.filePath : '');
      }
      return null;
    })
    .catch(error => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
}

export default function ExtractFramesPage() {
  const { t } = useTranslation();
  const [inputDir, setInputDir] = useState<string>('');
  const [outputDir, setOutputDir] = useState<string>('');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logMessage, setLogMessage] = useState<string>('');
  const [exitCode, setExitCode] = useState<number | null>();

  const extractionForm = (
    <div style={{ padding: '30px 30px', width: '60vw' }}>
      <div className="bp3-input-group" style={{ marginBottom: '10px' }}>
        <input
          type="text"
          className="bp3-input"
          placeholder={t('extract.chooseInput')}
          value={inputDir}
          onChange={e => {
            setInputDir(e.target.value);
          }}
        />
        <button
          aria-label="Search"
          type="submit"
          className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-search"
          onClick={() => {
            chooseDirectory(setInputDir);
          }}
        />
      </div>

      <div className="bp3-input-group" style={{ marginBottom: '10px' }}>
        <input
          type="text"
          className="bp3-input"
          placeholder={t('extract.chooseOutput')}
          value={outputDir}
          onChange={e => {
            setOutputDir(e.target.value);
          }}
        />
        <button
          aria-label="Search"
          type="submit"
          className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-search"
          onClick={() => {
            chooseSavePath(setOutputDir);
          }}
        />
      </div>

      <Button
        text={t('extract.extract')}
        icon="predictive-analysis"
        onClick={() => {
          // TODO: Run extraction.
        }}
        disabled={isRunning || inputDir === '' || outputDir === ''}
        style={{ marginBottom: '10px', backgroundColor: '#fff' }}
      />

      {exitCode !== undefined || isRunning ? (
        <PythonLogViewer
          logMessage={logMessage}
          isRunning={isRunning}
          exitCode={exitCode}
        />
      ) : null}
    </div>
  );

  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <Card elevation={Elevation.TWO}>
            <H1>{t('extract.title')}</H1>
            {extractionForm}
          </Card>
        </div>
      </div>
    </div>
  );
}
