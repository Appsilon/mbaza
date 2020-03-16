import React from 'react';
import { Card, Elevation, H5 } from '@blueprintjs/core';

type Props = {
  logMessage: string;
};

export default function PythonLogViewer(props: Props) {
  const { logMessage } = props;
  return (
    <Card interactive={false} elevation={Elevation.TWO}>
      <H5>Prediction logs</H5>
      <p>{logMessage}</p>
    </Card>
  );
}
