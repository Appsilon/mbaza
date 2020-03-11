import React from 'react';
import { Button } from '@blueprintjs/core';
import { spawn } from 'node-pty';
import PythonLogViewer from './PythonLogViewer';

type changeLogMessageType = (newChangeLogMessage: string) => {};

const computePredictions = (
  directory: string,
  changeLogMessage: changeLogMessageType
) => {
  const args: string[] = [
    './resources/compute_predictions.py',
    '--directory',
    directory
  ];

  const pyProcess = spawn('python', args, {});

  pyProcess.on('data', data => {
    // eslint-disable-next-line no-console
    changeLogMessage(data);
  });

  pyProcess.on('exit', exitCode => {
    // eslint-disable-next-line no-console
    console.log(`Exiting with code ${exitCode}`);
  });
};

const chooseDirectoryAndStartPredictions = (
  changeLogMessage: changeLogMessageType
) => {
  // eslint-disable-next-line global-require
  const { dialog } = require('electron').remote;
  dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then(result => {
      if (!result.canceled) {
        const directory = result.filePaths[0];
        computePredictions(directory, changeLogMessage);
      }
      return null;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log('error', error);
    });
};

type Props = {
  changeLogMessage: changeLogMessageType;
  logMessage: string;
};

export default function Classifier(props: Props) {
  const { logMessage } = props;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Mbaza AI!</h1>
      <h4>The first offline AI wildlife explorer</h4>

      <Button
        text="Choose directory and start predictions!"
        icon="predictive-analysis"
        onClick={() => {
          chooseDirectoryAndStartPredictions(props.changeLogMessage);
        }}
        style={{ marginBottom: '10px', backgroundColor: '#fff' }}
      />

      <PythonLogViewer logMessage={logMessage} />
    </div>
  );
}
