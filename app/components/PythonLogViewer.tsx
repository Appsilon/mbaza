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
import { useTranslation } from 'react-i18next';

type Props = {
  logMessage: string;
  isRunning: boolean;
  exitCode: number | null | undefined;
};

export default function PythonLogViewer(props: Props) {
  const { logMessage, isRunning, exitCode } = props;
  const { t } = useTranslation();

  const resultView =
    exitCode === 0 ? (
      <Callout intent={Intent.SUCCESS} title={t('classify.success')} />
    ) : (
      <Callout intent={Intent.DANGER} title={t('classify.failure')} />
    );

  return (
    <Card interactive={false} elevation={Elevation.TWO}>
      <H5>{t('classify.output')}</H5>
      {/* Code block retains newlines and is more appropriate for terminal output. */}
      <Pre style={{ whiteSpace: 'pre-wrap' }}>{logMessage}</Pre>
      {isRunning ? (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Spinner />
          <H6 style={{ marginTop: '20px' }}>{t('classify.inProgress')}</H6>
        </div>
      ) : null}
      {exitCode !== undefined ? resultView : null}
    </Card>
  );
}
