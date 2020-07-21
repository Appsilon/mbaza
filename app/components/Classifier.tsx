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

import PythonLogViewer from './PythonLogViewer';

type changeLogMessageType = (newChangeLogMessage: string | null) => {};
type changePathChoiceType = (newPath: string) => {};

const rootModelsDirectory = path.resolve('models');

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
  const isDev = process.env.NODE_ENV === 'development';
  const isWin = !isDev && process.platform === 'win32';
  const isLinux = !isDev && process.platform === 'linux';
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

  // if (!fs.existsSync(modelWeightsPath)) {
  //   displayErrorToast(t('classify.modelWeightsNotFound', { modelWeightsPath }));
  //   return;
  // }

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
      displayErrorToast(`${data}`);
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

type Props = {
  changeLogMessage: changeLogMessageType;
  changeDirectoryChoice: changePathChoiceType;
  changeSavePathChoice: changePathChoiceType;
  logMessage: string;
  directoryChoice: string;
  savePath: string;
};

export default function Classifier(props: Props) {
  const {
    directoryChoice,
    savePath,
    logMessage,
    changeDirectoryChoice,
    changeSavePathChoice,
    changeLogMessage
  } = props;
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [exitCode, setExitCode] = useState<number | null>();

  // TODO: Detect available models instead of hardcoding them. Display a warning
  // if there are no models available.
  const models = [
    { label: 'Gabon', value: 'gabon' },
    { label: 'Serengeti', value: 'serengeti' }
  ];
  const [modelName, setModelName] = useState<string>(models[0].value);
  const rootModelsDirectoryExists = fs.existsSync(rootModelsDirectory);

  const missingModelsDirectoryView = (
    <NonIdealState
      icon="search"
      title={t('classify.modelsDirectoryMissing.title')}
    >
      <p>
        {t('classify.modelsDirectoryMissing.description', {
          rootModelsDirectory
        })}
      </p>
    </NonIdealState>
  );

  const classifierFormView = (
    <div style={{ padding: '30px 30px', width: '60vw' }}>
      <div className="bp3-input-group" style={{ marginBottom: '10px' }}>
        <input
          type="text"
          className="bp3-input"
          placeholder={t('classify.chooseInput')}
          value={directoryChoice}
          onChange={e => {
            changeDirectoryChoice(e.target.value);
          }}
        />
        <button
          aria-label="Search"
          type="submit"
          className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-search"
          onClick={() => {
            chooseDirectory(changeDirectoryChoice);
          }}
        />
      </div>

      <div className="bp3-input-group" style={{ marginBottom: '10px' }}>
        <input
          type="text"
          className="bp3-input"
          placeholder={t('classify.chooseOutput')}
          value={savePath}
          onChange={e => {
            changeSavePathChoice(e.target.value);
          }}
        />
        <button
          aria-label="Search"
          type="submit"
          className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-search"
          onClick={() => {
            chooseSavePath(changeSavePathChoice);
          }}
        />
      </div>

      <div style={{ marginBottom: '5px' }}>{t('classify.chooseModel')}</div>
      <RadioGroup
        inline
        onChange={event => {
          setModelName(event.currentTarget.value);
        }}
        selectedValue={modelName}
      >
        {models.map(model => (
          <Radio label={model.label} value={model.value} key={model.value} />
        ))}
      </RadioGroup>

      <Button
        text={t('classify.find')}
        icon="predictive-analysis"
        onClick={() => {
          computePredictions(
            props.directoryChoice,
            props.savePath,
            modelName,
            changeLogMessage,
            setIsRunning,
            setExitCode,
            t
          );
        }}
        disabled={isRunning}
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
            <H1>{t('classify.title')}</H1>
            {rootModelsDirectoryExists
              ? classifierFormView
              : missingModelsDirectoryView}
          </Card>
        </div>
      </div>
    </div>
  );
}
