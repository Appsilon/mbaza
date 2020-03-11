import React from 'react';
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
  const { dialog } = require('electron').remote;
  const selectedFolders = dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  selectedFolders.then(result => {
    const directory = result.filePaths[0];
    computePredictions(directory);
  });
};

export default function ExplorePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Mbaza AI!</h1>
      <h4>The first offline AI wildlife explorer</h4>

      <Button
        text="Choose directory and start predictions!"
        icon="predictive-analysis"
        onClick={chooseDirectoryAndStartPredictions}
      />
    </div>
  );
}
