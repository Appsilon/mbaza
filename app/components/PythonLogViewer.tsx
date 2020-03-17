import React from 'react';
import { Card, Elevation, H5 } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

type Props = {
  logMessage: string;
};

export default function PythonLogViewer(props: Props) {
  const { logMessage } = props;
  const { t } = useTranslation();

  return (
    <Card interactive={false} elevation={Elevation.TWO}>
      <H5>{t('Prediction progress')}</H5>
      <p>{logMessage}</p>
    </Card>
  );
}
