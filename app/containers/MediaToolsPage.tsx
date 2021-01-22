import React, { useState } from 'react';
import {
  Button,
  Card,
  Elevation,
  H1,
  Intent,
  NonIdealState,
  Toaster,
  Callout,
  RadioGroup,
  Radio
} from '@blueprintjs/core';
import { useTranslation, Trans } from 'react-i18next';
import path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';
import { TFunction } from 'i18next';

import PythonLogViewer from '../components/PythonLogViewer';
import {
  isDev,
  isLinux,
  isWin,
  rootModelsDirectory
} from '../utils/environment';

type changePathChoiceType = (newPath: string) => void;

const toaster = Toaster.create({});

function displayErrorToast(message: string) {
  toaster.show({
    message,
    intent: Intent.DANGER,
    icon: 'warning-sign'
  });
}

function runExtractProcess(
  baseArgs: string[],
  t: TFunction
): ChildProcessWithoutNullStreams | null {
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
  } else if (isLinux) {
    workdir = path.join(rootModelsDirectory, 'runner_linux', 'main');
    program = path.join(workdir, 'main');
  } else {
    throw new Error(`Unsupported operating system: ${process.platform}`);
  }
  args.push(...baseArgs);

  if (!fs.existsSync(program)) {
    displayErrorToast(t('classify.modelExecutableNotFound', { program }));
    return null;
  }
  return spawn(program, args, { cwd: workdir });
}

const extractImages = (
  inputPath: string,
  outputPath: string,
  thumbnailMode: boolean,
  changeLogMessage: (message: string) => void,
  setIsRunning: (isRunning: boolean) => void,
  setExitCode: (exitCode: number | null | undefined) => void,
  t: TFunction
) => {
  const args: string[] = [
    'extract_images',
    '--input_folder',
    inputPath,
    '--output_folder',
    outputPath
  ];
  if (thumbnailMode) {
    args.push('--thumbnails');
  }
  const process = runExtractProcess(args, t);
  if (process !== null) {
    setExitCode(undefined);
    setIsRunning(true);
    process.stdout.on('data', data => {
      changeLogMessage(`${data}`);
    });
    process.stderr.on('data', data => {
      // eslint-disable-next-line no-console
      console.log(`Extractor stderr: ${data}`);
      changeLogMessage(`${data}`);
    });
    process.on('exit', exitCode => {
      // eslint-disable-next-line no-console
      console.log(`Extractor exited with code ${exitCode}`);
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

const EXTRACT_FRAMES = 'EXTRACT_FRAMES';
const CREATE_THUMBNAILS = 'CREATE_THUMBNAILS';

export default function MediaToolsPage() {
  const { t } = useTranslation();

  const [currentMode, setCurrentMode] = useState<string>(EXTRACT_FRAMES);
  const [inputDir, setInputDir] = useState<string>('');
  const [outputDir, setOutputDir] = useState<string>('');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logMessage, setLogMessage] = useState<string>('');
  const [exitCode, setExitCode] = useState<number | null>();

  const appendLogMessage = (newMessage: string) => {
    setLogMessage(oldMessage => oldMessage + newMessage);
  };

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

  const extractionForm = (
    <div style={{ padding: '30px 30px', width: '60vw' }}>
      <RadioGroup
        selectedValue={currentMode}
        onChange={e => setCurrentMode(e.currentTarget.value)}
        label={t('tools.mode')}
      >
        <Radio value={EXTRACT_FRAMES} label={t('tools.extractFramesDetail')} />
        <Radio
          value={CREATE_THUMBNAILS}
          label={t('tools.createThumbnailsDetail')}
        />
      </RadioGroup>

      <div className="bp3-input-group" style={{ marginBottom: '10px' }}>
        <input
          type="text"
          className="bp3-input"
          placeholder={t('tools.chooseInput')}
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
          placeholder={t('tools.chooseOutput')}
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
            chooseDirectory(setOutputDir);
          }}
        />
      </div>

      <Button
        text={
          currentMode === EXTRACT_FRAMES
            ? t('tools.extractFrames')
            : t('tools.createThumbnails')
        }
        onClick={() => {
          setLogMessage(''); // Remove any log from previous runs.
          extractImages(
            inputDir,
            outputDir,
            currentMode === CREATE_THUMBNAILS,
            appendLogMessage,
            setIsRunning,
            setExitCode,
            t
          );
        }}
        disabled={isRunning || inputDir === '' || outputDir === ''}
        style={{ marginBottom: '10px', backgroundColor: '#fff' }}
      />

      {exitCode !== undefined || isRunning ? (
        <PythonLogViewer
          title={t('tools.logTitle')}
          successMessage={t('tools.success')}
          failureMessage={t('tools.failure')}
          progressMessage={t('tools.inProgress')}
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
            <H1>{t('tools.title')}</H1>
            {rootModelsDirectoryExists
              ? extractionForm
              : missingModelsDirectoryView}
          </Card>
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <Callout intent={Intent.PRIMARY}>
            <Trans i18nKey="tools.info" />
          </Callout>
        </div>
      </div>
    </div>
  );
}
