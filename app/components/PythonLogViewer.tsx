import React from 'react';
import { Callout, Card, Elevation, H5, H6, Intent, Pre, Spinner } from '@blueprintjs/core';
import styles from './PythonLogViewer.scss';

type Props = {
  title: string;
  successMessage: string;
  failureMessage: string;
  progressMessage: string;
  logMessage: string;
  isRunning: boolean;
  exitCode: number | null | undefined;
};

export default function PythonLogViewer(props: Props) {
  const {
    title,
    successMessage,
    failureMessage,
    progressMessage,
    logMessage,
    isRunning,
    exitCode
  } = props;

  const resultView =
    exitCode === 0 ? (
      <Callout intent={Intent.SUCCESS} title={successMessage} />
    ) : (
      <Callout intent={Intent.DANGER} title={failureMessage} />
    );

  return (
    <Card className={styles.card} interactive={false} elevation={Elevation.TWO}>
      <H5>{title}</H5>
      <Pre className={styles.logMessage}>{logMessage}</Pre>
      {isRunning ? (
        <div className={styles.preloader}>
          <Spinner />
          <H6 className={styles.message}>{progressMessage}</H6>
        </div>
      ) : null}
      {exitCode !== undefined ? resultView : null}
    </Card>
  );
}
