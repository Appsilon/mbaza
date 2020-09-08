import React from 'react';
import {
  Callout,
  Card,
  Elevation,
  H5,
  H6,
  Intent,
  Pre,
  Spinner
} from '@blueprintjs/core';

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
    <Card interactive={false} elevation={Elevation.TWO}>
      <H5>{title}</H5>
      <Pre style={{ whiteSpace: 'pre-wrap' }}>{logMessage}</Pre>
      {isRunning ? (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Spinner />
          <H6 style={{ marginTop: '20px' }}>{progressMessage}</H6>
        </div>
      ) : null}
      {exitCode !== undefined ? resultView : null}
    </Card>
  );
}
