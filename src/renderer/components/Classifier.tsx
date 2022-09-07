import {
  Button,
  Callout,
  Card,
  Elevation,
  H1,
  InputGroup,
  Intent,
  Radio,
  RadioGroup,
} from '@blueprintjs/core';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Model, MODELS } from '../../common/models';
import prepareResults from '../inference';
import { openCsvDialog, openDirectoryDialog, saveCsvDialog } from '../utils/fileDialog';
import styles from './Classifier.module.scss';
import LogViewer, { TaskStatus } from './LogViewer';
import PathInput from './PathInput';

function useStatusMessage(status: TaskStatus) {
  const { t } = useTranslation();
  switch (status) {
    case TaskStatus.IN_PROGRESS:
      return t('classify.inProgress');
    case TaskStatus.SUCCESS:
      return t('classify.success');
    case TaskStatus.FAILURE:
      return t('classify.failure');
    default:
      return '';
  }
}

export default function Classifier() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NOT_STARTED);
  const [inputPath, setInputPath] = useState<string>('');
  const [outputPath, setOutputPath] = useState<string>('');
  const [stationsCsvPath, setStationsCsvPath] = useState<string>('');
  const [model, setModel] = useState<Model>('CENTRAL_AFRICAN_FORESTS');
  const [projectId, setProjectId] = useState<string>('');
  const [deploymentId, setDeploymentId] = useState<string>('');

  const message = useStatusMessage(status);

  const runInference = async () => {
    setStatus(TaskStatus.IN_PROGRESS);
    try {
      await prepareResults(inputPath, outputPath, stationsCsvPath, model, projectId, deploymentId);
      setStatus(TaskStatus.SUCCESS);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      setStatus(TaskStatus.FAILURE);
    }
  };

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
        onChange={(event) => {
          setModel(event.currentTarget.value as Model);
        }}
        selectedValue={model}
      >
        {Object.entries(MODELS).map(([key, m]) => (
          <Radio label={m.name} value={key} key={key} />
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
        onClick={runInference}
        disabled={status === TaskStatus.IN_PROGRESS || !inputPath || !outputPath}
      />

      <LogViewer title={t('classify.logTitle')} status={status} message={message} />
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Card className={styles.card} elevation={Elevation.TWO}>
          <H1>{t('classify.title')}</H1>
          {classifierFormView}
        </Card>
        <Callout className={styles.callout} intent={Intent.PRIMARY}>
          <Trans i18nKey="classify.info" />
        </Callout>
      </div>
    </div>
  );
}
