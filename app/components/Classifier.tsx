import React, { useState } from 'react';
import {
  Button,
  Card,
  Elevation,
  H1,
  InputGroup,
  Intent,
  Radio,
  RadioGroup,
  Toaster,
  Callout
} from '@blueprintjs/core';
import { useTranslation, Trans } from 'react-i18next';
import path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';
import { TFunction } from 'i18next';
import { remote } from 'electron';

import PythonLogViewer from './PythonLogViewer';
import showSaveCsvDialog from '../utils/showSaveCsvDialog';
import { isDev, isLinux, isWin, rootModelsDirectory } from '../utils/environment';
import MissingModelsMessage from './MissingModelsMessage';

type changeLogMessageType = (newChangeLogMessage: string | null) => {};
type changePathChoiceType = (newPath: string) => {};

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

function runModelProcess(baseArgs: string[], t: TFunction): ChildProcessWithoutNullStreams | null {
  const gridFilePath = path.join(rootModelsDirectory, 'biomonitoring_stations.csv');

  let workdir;
  let program;
  const args = [];
  const command = 'infer_to_csv';

  if (isDev) {
    workdir = path.join(rootModelsDirectory, 'runner');
    program = path.join(workdir, 'venv', 'bin', 'python3');
    args.push('main.py');
    args.push(command);
  } else if (isWin) {
    workdir = path.join(rootModelsDirectory, 'runner_win', 'main');
    program = path.join(workdir, 'main.exe');
    args.push(command);
    args.push('--pytorch_num_workers=0');
  } else if (isLinux) {
    workdir = path.join(rootModelsDirectory, 'runner_linux', 'main');
    program = path.join(workdir, 'main');
    args.push(command);
  } else {
    throw new Error(`Unsupported operating system for running models: ${process.platform}`);
  }

  if (!fs.existsSync(program)) {
    displayErrorToast(t('classify.modelExecutableNotFound', { program }));
    return null;
  }

  if (fs.existsSync(gridFilePath)) {
    args.push('--grid_file', gridFilePath);
  } else {
    displayWarningToast(t('classify.biomonitoringStationsFileNotFound', { gridFilePath }));
  }

  args.push(...baseArgs);
  return spawn(program, args, { cwd: workdir });
}

const computePredictions = (
  directory: string,
  savePath: string,
  modelName: string,
  projectId: string,
  deploymentId: string,
  changeLogMessage: changeLogMessageType,
  setIsRunning: (value: boolean) => void,
  setExitCode: (value: number | null | undefined) => void,
  t: TFunction
) => {
  const modelWeightsPath = path.join(rootModelsDirectory, modelName, 'trained_model.pkl');

  const args: string[] = [
    '--input_folder',
    directory,
    '--output',
    savePath,
    '--model',
    modelWeightsPath,
    '--project_id',
    projectId,
    '--deployment_id',
    deploymentId,
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

async function chooseDirectory() {
  // eslint-disable-next-line global-require
  const dialog = await remote.dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (!dialog.canceled) {
    return dialog.filePaths[0];
  }
  return undefined;
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
  const [projectId, setProjectId] = useState<string>('');
  const [deploymentId, setDeploymentId] = useState<string>('');

  // TODO: Detect available models instead of hardcoding them. Display a warning
  // if there are no models available.
  const models = [
    { label: 'Central African forests', value: 'central_african_forests' },
    { label: 'East African savannas', value: 'east_african_savannas' }
  ];
  const [modelName, setModelName] = useState<string>(models[0].value);
  const rootModelsDirectoryExists = fs.existsSync(rootModelsDirectory);

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
          onClick={async () => {
            const directory = await chooseDirectory();
            if (directory !== undefined) changeDirectoryChoice(directory);
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
          onClick={async () => {
            const newSavePath = await showSaveCsvDialog('classification_result.csv');
            if (newSavePath !== undefined) changeSavePathChoice(newSavePath);
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

      <InputGroup
        value={projectId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setProjectId(e.target.value);
        }}
        placeholder={t('classify.projectId')}
        style={{ marginBottom: '10px' }}
      />
      <InputGroup
        value={deploymentId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setDeploymentId(e.target.value);
        }}
        placeholder={t('classify.deploymentId')}
        style={{ marginBottom: '10px' }}
      />

      <Button
        text={t('classify.find')}
        icon="predictive-analysis"
        onClick={() => {
          computePredictions(
            props.directoryChoice,
            props.savePath,
            modelName,
            projectId,
            deploymentId,
            changeLogMessage,
            setIsRunning,
            setExitCode,
            t
          );
        }}
        disabled={isRunning || directoryChoice === '' || savePath === ''}
        style={{ marginBottom: '10px', backgroundColor: '#fff' }}
      />

      {exitCode !== undefined || isRunning ? (
        <PythonLogViewer
          title={t('classify.logTitle')}
          successMessage={t('classify.success')}
          failureMessage={t('classify.failure')}
          progressMessage={t('classify.inProgress')}
          logMessage={logMessage}
          isRunning={isRunning}
          exitCode={exitCode}
        />
      ) : null}
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'scroll', maxHeight: 'calc(100vh - 50px)' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <Card elevation={Elevation.TWO}>
            <H1>{t('classify.title')}</H1>
            {rootModelsDirectoryExists ? classifierFormView : <MissingModelsMessage />}
          </Card>
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <Callout intent={Intent.PRIMARY}>
            <Trans i18nKey="classify.info" />
          </Callout>
        </div>
      </div>
    </div>
  );
}
