import { Button, Callout, Card, Elevation, FormGroup, H1, Intent, Slider } from '@blueprintjs/core';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import LogViewer, { TaskStatus } from '../components/LogViewer';
import PathInput from '../components/PathInput';
import createThumbnails from '../utils/createThumbnails';
import { openDirectoryDialog } from '../utils/fileDialog';
import styles from './MediaToolsPage.module.scss';

const THUMBNAIL_SIZE_LABELS = new Map<number, string>([
  [200, 'tools.thumbnailSizeSmall'],
  [500, 'tools.thumbnailSizeMedium'],
  [800, 'tools.thumbnailSizeLarge'],
]);

function useStatusMessage(status: TaskStatus) {
  const { t } = useTranslation();
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return t('tools.inProgress');
    case TaskStatus.SUCCESS:
      return t('tools.success');
    case TaskStatus.FAILURE:
      return t('tools.failure');
    default:
      return '';
  }
}

export default function MediaToolsPage() {
  const { t } = useTranslation();
  const [thumbnailSize, setThumbnailSize] = useState<number>(350);
  const [inputDir, setInputDir] = useState<string>('');
  const [outputDir, setOutputDir] = useState<string>('');

  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NOT_STARTED);
  const message = useStatusMessage(status);

  const handleCreateThumbnails = async () => {
    setStatus(TaskStatus.IN_PROGRESS);
    try {
      await createThumbnails(inputDir, outputDir, thumbnailSize);
      setStatus(TaskStatus.SUCCESS);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      setStatus(TaskStatus.FAILURE);
    }
  };

  const labelRenderer = (value: number, options?: { isHandleTooltip: boolean }) => {
    if (options && options.isHandleTooltip) {
      return `${value.toFixed()}\u00a0px`; // Use non-breaking space between number and unit.
    }
    const label = THUMBNAIL_SIZE_LABELS.get(value);
    return label ? t(label) : '';
  };
  const parameterSlider = (
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

  const extractionForm = (
    <div className={styles.form}>
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
        text={t('tools.createThumbnails')}
        onClick={handleCreateThumbnails}
        disabled={status === TaskStatus.IN_PROGRESS || inputDir === '' || outputDir === ''}
      />
      <LogViewer title={t('tools.logTitle')} status={status} message={message} />
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Card className={styles.card} elevation={Elevation.TWO}>
          <H1>{t('tools.title')}</H1>
          {extractionForm}
        </Card>
        <Callout className={styles.callout} intent={Intent.PRIMARY}>
          <Trans i18nKey="tools.info" />
        </Callout>
      </div>
    </div>
  );
}
