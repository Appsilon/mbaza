import React from 'react';
import { Card, Elevation, H5, H6, Spinner } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

type Props = {
  logMessage: string;
  isRunning: boolean;
};

export default function PythonLogViewer(props: Props) {
  const { logMessage, isRunning } = props;
  const { t } = useTranslation();

  return (
    <Card interactive={false} elevation={Elevation.TWO}>
      <H5>{t('classify.output')}</H5>
      {/* Code block retains newlines and is more appropriate for terminal output. */}
      <code>{logMessage}</code>
      {isRunning ? (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Spinner />
          <H6 style={{ marginTop: '20px' }}>{t('classify.inProgress')}</H6>
        </div>
      ) : null}
    </Card>
  );
}
