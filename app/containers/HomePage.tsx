import React from 'react';
import { execFile, ExecException } from 'child_process';
import { Button } from '@blueprintjs/core';

const computePredictions = () => {
  // eslint-disable-next-line no-console
  console.log('Will start streaming predictions now. Output will appear soon.');

  // TODO(wojtek): catch stdout here and display it in some textbox in the UI
  // TODO(wojtek): make sure the output is streamed instead of returned once

  const args: ReadonlyArray<string> = [
    './resources/compute_predictions.py',
    '--directory',
    '/home/wojtek'
  ];
  execFile(
    'python',
    args,
    (
      error: ExecException | null,
      stdout: string | Buffer,
      stderr: string | Buffer
    ) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(stderr);
        throw error;
      }
      // eslint-disable-next-line no-console
      console.log(stdout);
    }
  );
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
