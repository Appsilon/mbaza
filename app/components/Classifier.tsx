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

import PythonLogViewer from './PythonLogViewer';
import { openCsvDialog, openDirectoryDialog, saveCsvDialog } from '../utils/fileDialog';
import { isDev, isLinux, isWin, rootModelsDirectory } from '../utils/environment';
import MissingModelsMessage from './MissingModelsMessage';
import PathInput from './PathInput';
import styles from './Classifier.module.scss';

const toaster = Toaster.create({});

function displayErrorToast(message: string) {
  toaster.show({
    message,
    intent: Intent.DANGER,
    icon: 'warning-sign'
  });
}

function runModelProcess(baseArgs: string[], t: TFunction): ChildProcessWithoutNullStreams | null {
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

  args.push(...baseArgs);
  return spawn(program, args, { cwd: workdir });
}

const computePredictions = (
  inputPath: string,
  outputPath: string,
  gridFilePath: string,
  modelName: string,
  projectId: string,
  deploymentId: string,
  setLogMessage: (value: string) => void,
  setIsRunning: (value: boolean) => void,
  setExitCode: (value: number | null | undefined) => void,
  t: TFunction
) => {
  const modelWeightsPath = path.join(rootModelsDirectory, modelName, 'trained_model.pkl');

  const args: string[] = [
    '--input_folder',
    inputPath,
    '--output',
    outputPath,
    '--model',
    modelWeightsPath,
    '--project_id',
    projectId,
    '--deployment_id',
    deploymentId,
    '--overwrite'
  ];

  if (gridFilePath) {
    args.push('--grid_file', gridFilePath);
  }
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
    setLogMessage('');
    setExitCode(undefined);
    setIsRunning(true);
    process.stdout.on('data', data => {
      setLogMessage(`${data}`);
    });
    process.stderr.on('data', data => {
      // eslint-disable-next-line no-console
      console.log(`classifier stderr: ${data}`);
      setLogMessage(`${data}`);
    });
    process.on('exit', exitCode => {
      // eslint-disable-next-line no-console
      console.log(`Classifier exited with code ${exitCode}`);
      setIsRunning(false);
      setExitCode(exitCode);
    });
  }
};

export default function Classifier() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [exitCode, setExitCode] = useState<number | null>();

  const [inputPath, setInputPath] = useState<string>('');
  const [outputPath, setOutputPath] = useState<string>('');
  const [stationsCsvPath, setStationsCsvPath] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [deploymentId, setDeploymentId] = useState<string>('');
  const [logMessage, setLogMessage] = useState<string>('');

  // TODO: Detect available models instead of hardcoding them. Display a warning
  // if there are no models available.
  const models = [
    { label: 'Central African forests', value: 'central_african_forests' },
    { label: 'East African savannas', value: 'east_african_savannas' }
  ];
  const [modelName, setModelName] = useState<string>(models[0].value);
  const rootModelsDirectoryExists = fs.existsSync(rootModelsDirectory);

  const classifierFormView = (
    <div className={styles.form}>
      <PathInput
        className={styles.pathInput}
        placeholder={t('classify.chooseInput')}
        value={inputPath}
        onChange={setInputPath}
        showDialog={openDirectoryDialog}
      />
      <PathInput
        className={styles.pathInput}
        placeholder={t('classify.chooseOutput')}
        value={outputPath}
        onChange={setOutputPath}
        showDialog={() => saveCsvDialog('classification_result')}
      />
      <PathInput
        className={styles.pathInput}
        placeholder={t('classify.chooseStationsCsv')}
        value={stationsCsvPath}
        onChange={setStationsCsvPath}
        showDialog={openCsvDialog}
      />

      <div className={styles.radioLabel}>{t('classify.chooseModel')}</div>
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
        className={styles.textInput}
        value={projectId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setProjectId(e.target.value);
        }}
        placeholder={t('classify.projectId')}
      />
      <InputGroup
        className={styles.textInput}
        value={deploymentId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setDeploymentId(e.target.value);
        }}
        placeholder={t('classify.deploymentId')}
      />

      <Button
        className={styles.button}
        text={t('classify.find')}
        icon="predictive-analysis"
        onClick={() => {
          computePredictions(
            inputPath,
            outputPath,
            stationsCsvPath,
            modelName,
            projectId,
            deploymentId,
            setLogMessage,
            setIsRunning,
            setExitCode,
            t
          );
        }}
        disabled={isRunning || inputPath === '' || outputPath === ''}
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Card className={styles.card} elevation={Elevation.TWO}>
          <H1>{t('classify.title')}</H1>
          {rootModelsDirectoryExists ? classifierFormView : <MissingModelsMessage />}
        </Card>
        <Callout className={styles.callout} intent={Intent.PRIMARY}>
          <Trans i18nKey="classify.info" />
        </Callout>
      </div>
    </div>
  );
}
