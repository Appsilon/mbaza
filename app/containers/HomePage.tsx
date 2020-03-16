import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@blueprintjs/core';

import { spawn } from 'node-pty';

const computePredictions = (directory: string) => {
  // TODO(wojtek): catch stdout here and display it in some textbox in the UI

  const args: string[] = [
    './resources/compute_predictions.py',
    '--directory',
    directory
  ];

  const pyProcess = spawn('python', args, {});

  pyProcess.on('data', data => {
    // eslint-disable-next-line no-console
    console.log(data);
  });

  pyProcess.on('exit', exitCode => {
    // eslint-disable-next-line no-console
    console.log(`Exiting with code ${exitCode}`);
  });
};

const chooseDirectoryAndStartPredictions = () => {
  // eslint-disable-next-line global-require
  const { dialog } = require('electron').remote;
  dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then(result => {
      if (!result.canceled) {
        const directory = result.filePaths[0];
        computePredictions(directory);
      }
      return null;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log('error', error);
    });
};

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('Welcome to Mbaza AI!')}</h1>
      <h4>{t('The first offline AI wildlife explorer')}</h4>

      <Button
        text={t('Choose directory and start predictions!')}
        icon="predictive-analysis"
        onClick={chooseDirectoryAndStartPredictions}
      />
    </div>
  );
}
