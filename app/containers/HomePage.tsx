import React from 'react';
import { Button } from '@blueprintjs/core';

import { spawn } from 'node-pty';

const computePredictions = () => {
  // TODO(wojtek): catch stdout here and display it in some textbox in the UI
  // TODO(wojtek): create a text input box for the "directory" parameter
  // TODO(wojtek): make sure the "directory" parameter is intercepted from JS and passed to Python correctly

  const args: string[] = [
    './resources/compute_predictions.py',
    '--directory',
    '/home/wojtek'
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

export default function ExplorePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to mbaza!</h1>
      <h4>The first and foremost AI wildlife explorer</h4>

      <Button
        text="start predictions!"
        icon="predictive-analysis"
        onClick={computePredictions}
      />
    </div>
  );
}
