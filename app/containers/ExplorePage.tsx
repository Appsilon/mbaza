import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { useTranslation } from 'react-i18next';

type SetPathType = (path: string) => {};

function chooseFile(changeFileChoice: SetPathType) {
  // eslint-disable-next-line global-require
  const { dialog } = require('electron').remote;
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'CSV', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    .then(result => {
      if (!result.canceled) {
        const directory = result.filePaths[0];
        changeFileChoice(directory);
      }
      return null;
    })
    .catch(error => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState();
  // TODO: read data from the loaded csv
  // const lastFolder = fs.readdirSync('results/');
  // const lastFile = lastFolder.sort().splice(-1)[0];
  // let data = [];
  // const result = csv(`../results/${lastFile}/results.csv`).then(function(val) {
  //   data = val;
  //   return val;
  // });

  const trace1 = {
    x: ['2020-10-04', '2021-11-04', '2023-12-04', '2024-12-04', '2025-12-04'],
    y: [90, 40, 60, 90, 30],
    type: 'scatter',
    name: 'Elephant'
  };
  const trace2 = {
    x: ['2020-10-04', '2021-11-04', '2023-12-04', '2024-12-04', '2025-12-04'],
    y: [150, 30, 80, 40, 12],
    type: 'scatter',
    name: 'Bird'
  };
  const data = [trace1, trace2];

  return (
    <div style={{ padding: '10px', flex: 1 }}>
      <h1>{t('Explore')}</h1>
      <div className="bp3-input-group" style={{ marginBottom: '10px' }}>
        <input
          type="text"
          className="bp3-input"
          placeholder={t('Choose results file to analyze')}
          value={filePath}
          onChange={e => {
            setFilePath(e.target.value);
          }}
        />
        <button
          aria-label="Search"
          type="submit"
          className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-search"
          onClick={() => {
            chooseFile(setFilePath as SetPathType);
          }}
        />
      </div>
      {filePath && (
        <Plot data={data as any} layout={{ responsive: true } as any} />
      )}
    </div>
  );
  // <Table numRows={5}>
  //   <Column name="path" cellRenderer={pathRender} />
  //   <Column name="class" cellRenderer={classRender} />
  // </Table>
}
