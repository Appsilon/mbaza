import React from 'react';
import { Button } from '@blueprintjs/core';

import { spawn } from 'node-pty';

const computePredictions = () => {
  // eslint-disable-next-line no-console
  console.log('Will start streaming predictions now. Output will appear soon.');

  // TODO(wojtek): catch stdout here and display it in some textbox in the UI

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
      <Button
        text="start predictions!"
        icon="predictive-analysis"
        onClick={computePredictions}
      />
      <h1>Welcome to mbaza!</h1>
      <h4>The first and foremost AI wildlife explorer</h4>

    </div>
  );
}
