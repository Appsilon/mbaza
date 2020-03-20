import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { useTranslation } from 'react-i18next';
import { csv } from 'd3-fetch';
import { Column, Table, Cell } from '@blueprintjs/table';

type SetPathType = (path: string) => {};

// eslint-disable-next-line
function chooseFile(changeFileChoice: SetPathType, setData: React.Dispatch<any>) {
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
        const file = result.filePaths[0];
        changeFileChoice(file);
        return file;
      }
      return '';
    })
    .then(file => csv(file))
    .then(data => {
      setData(data);
      return data;
    })
    .catch(error => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState();
  const [data, setData] = useState();

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
  const data2 = [trace1, trace2];

  const table = (
    <Table numRows={data.length} enableColumnReordering>
      <Column
        name="Station"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].station}</Cell>
        )}
      />
      <Column
        name="Check"
        cellRenderer={(rowIndex: number) => <Cell>{data[rowIndex].check}</Cell>}
      />
      <Column
        name="Camera"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].camera}</Cell>
        )}
      />
      <Column
        name="Date and time"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].exif_datetime}</Cell>
        )}
      />
      <Column
        name="GPS"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].exif_gps_lat}</Cell>
        )}
      />
      <Column
        name="Predicted class"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].pred_1}</Cell>
        )}
      />
      <Column
        name="Certainty"
        cellRenderer={(rowIndex: number) => (
          <Cell>{data[rowIndex].score_1}</Cell>
        )}
      />
    </Table>
  );
  return (
    <div style={{ padding: '10px 30px', width: '100vw' }}>
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
            chooseFile(setFilePath as SetPathType, setData);
          }}
        />
      </div>
      {filePath && (
        // eslint-disable-next-line
        <Plot data={data2 as any} layout={{ responsive: true } as any} />
      )}

      {table}
    </div>
  );
}
