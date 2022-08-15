import {
  Button,
  Callout,
  Card,
  Elevation,
  FormGroup,
  H1,
  Intent,
  Radio,
  RadioGroup,
  Slider,
  Toaster,
} from '@blueprintjs/core';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import fs from 'fs';
import { TFunction } from 'i18next';
import path from 'path';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import MissingModelsMessage from '../components/MissingModelsMessage';
import PathInput from '../components/PathInput';
import PythonLogViewer from '../components/PythonLogViewer';
import { isDev, isLinux, isWin, rootModelsDirectory } from '../utils/environment';
import { openDirectoryDialog } from '../utils/fileDialog';
import styles from './MediaToolsPage.module.scss';

const toaster = Toaster.create({});

function displayErrorToast(message: string) {
  toaster.show({
    message,
    intent: Intent.DANGER,
    icon: 'warning-sign',
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

type ToolMode = 'EXTRACT_FRAMES' | 'CREATE_THUMBNAILS';

type MediaToolOptions = {
  inputDir: string;
  outputDir: string;
  toolMode: ToolMode;
  frameInterval?: number;
  maxThumbnailDimensions?: number;
};

const extractImages = (
  options: MediaToolOptions,
  changeLogMessage: (message: string) => void,
  setIsRunning: (isRunning: boolean) => void,
  setExitCode: (exitCode: number | null | undefined) => void,
  t: TFunction
) => {
  const args: string[] = [
    'extract_images',
    '--input_folder',
    options.inputDir,
    '--output_folder',
    options.outputDir,
  ];
  if (options.toolMode === 'EXTRACT_FRAMES') {
    if (options.frameInterval !== undefined) {
      args.push('--frame_interval', options.frameInterval.toFixed());
    }
  } else if (options.toolMode === 'CREATE_THUMBNAILS') {
    args.push('--thumbnails');
    if (options.maxThumbnailDimensions !== undefined) {
      args.push('--max_thumbnail_dimensions', options.maxThumbnailDimensions.toFixed());
    }
  }
  const process = runExtractProcess(args, t);
  if (process !== null) {
    setExitCode(undefined);
    setIsRunning(true);
    process.stdout.on('data', (data) => {
      changeLogMessage(`${data}`);
    });
    process.stderr.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`Extractor stderr: ${data}`);
      changeLogMessage(`${data}`);
    });
    process.on('exit', (exitCode) => {
      // eslint-disable-next-line no-console
      console.log(`Extractor exited with code ${exitCode}`);
      setIsRunning(false);
      setExitCode(exitCode);
    });
  }
};

const THUMBNAIL_SIZE_LABELS = new Map<number, string>([
  [200, 'tools.thumbnailSizeSmall'],
  [500, 'tools.thumbnailSizeMedium'],
  [800, 'tools.thumbnailSizeLarge'],
]);

export default function MediaToolsPage() {
  const { t } = useTranslation();

  const [toolMode, setToolMode] = useState<ToolMode>('EXTRACT_FRAMES');
  const [thumbnailSize, setThumbnailSize] = useState<number>(350);
  const [extractionInterval, setExtractionInterval] = useState<number>(5);
  const [inputDir, setInputDir] = useState<string>('');
  const [outputDir, setOutputDir] = useState<string>('');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logMessage, setLogMessage] = useState<string>('');
  const [exitCode, setExitCode] = useState<number | null>();

  const appendLogMessage = (newMessage: string) => {
    setLogMessage((oldMessage) => oldMessage + newMessage);
  };

  const rootModelsDirectoryExists = fs.existsSync(rootModelsDirectory);

  const runTool = () => {
    const options: MediaToolOptions = { inputDir, outputDir, toolMode };
    if (toolMode === 'EXTRACT_FRAMES') {
      options.frameInterval = extractionInterval;
    } else if (toolMode === 'CREATE_THUMBNAILS') {
      options.maxThumbnailDimensions = thumbnailSize;
    }
    setLogMessage(''); // Remove any log from previous runs.
    extractImages(options, appendLogMessage, setIsRunning, setExitCode, t);
  };

  let parameterSlider;
  if (toolMode === 'EXTRACT_FRAMES') {
    parameterSlider = (
      <FormGroup label={t('tools.extractionInterval')}>
        <Slider value={extractionInterval} onChange={setExtractionInterval} min={1} max={10} />
      </FormGroup>
    );
  } else if (toolMode === 'CREATE_THUMBNAILS') {
    const labelRenderer = (value: number, options?: { isHandleTooltip: boolean }) => {
      if (options && options.isHandleTooltip) {
        return `${value.toFixed()}\u00a0px`; // Use non-breaking space between number and unit.
      }
      const label = THUMBNAIL_SIZE_LABELS.get(value);
      return label ? t(label) : '';
    };
    parameterSlider = (
      <FormGroup label={t('tools.thumbnailSize')}>
        <Slider
          value={thumbnailSize}
          onChange={setThumbnailSize}
          labelValues={[...THUMBNAIL_SIZE_LABELS.keys()]}
          labelRenderer={labelRenderer}
          min={200}
          max={800}
          stepSize={10}
        />
      </FormGroup>
    );
  }

  const extractionForm = (
    <div className={styles.form}>
      <RadioGroup
        selectedValue={toolMode}
        onChange={(e) => setToolMode(e.currentTarget.value as ToolMode)}
        label={t('tools.mode')}
      >
        <Radio value="EXTRACT_FRAMES" label={t('tools.extractFramesDetail')} />
        <Radio value="CREATE_THUMBNAILS" label={t('tools.createThumbnailsDetail')} />
      </RadioGroup>
      <div className={styles.slider}>{parameterSlider}</div>

      <PathInput
        className={styles.pathInput}
        placeholder={t('tools.chooseInput')}
        value={inputDir}
        onChange={setInputDir}
        showDialog={openDirectoryDialog}
      />
      <PathInput
        className={styles.pathInput}
        placeholder={t('tools.chooseOutput')}
        value={outputDir}
        onChange={setOutputDir}
        showDialog={openDirectoryDialog}
      />

      <Button
        className={styles.button}
        text={
          toolMode === 'EXTRACT_FRAMES' ? t('tools.extractFrames') : t('tools.createThumbnails')
        }
        onClick={runTool}
        disabled={isRunning || inputDir === '' || outputDir === ''}
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Card className={styles.card} elevation={Elevation.TWO}>
          <H1>{t('tools.title')}</H1>
          {rootModelsDirectoryExists ? extractionForm : <MissingModelsMessage />}
        </Card>
        <Callout className={styles.callout} intent={Intent.PRIMARY}>
          <Trans i18nKey="tools.info" />
        </Callout>
      </div>
    </div>
  );
}
