import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { useTranslation } from 'react-i18next';
import { csv } from 'd3-fetch';
import { Column, Table, Cell } from '@blueprintjs/table';
import { Card, Elevation } from '@blueprintjs/core';
import _ from 'lodash';
import Map from '../components/Map';

type Observation = {
  exif_datetime: string;
  pred_1: string;
  score_1: string;
  station: string;
  check: string;
  camera: string;
  exif_gps_lat: string;
};

// eslint-disable-next-line
function chooseFile(changeFileChoice: (path: string) => void, setData: (data: Observation[]) => void) {
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
      return undefined;
    })
    .then(file => {
      if (file !== undefined) {
        return csv(file);
      }
      return undefined;
    })
    .then(data => {
      if (data !== undefined) {
        setData((data as unknown) as Observation[]);
        return data;
      }
      return undefined;
    })
    .catch(error => {
      // eslint-disable-next-line no-alert
      alert(error);
    });
}

function getDateFromRow(row: Observation) {
  const onlyDay = row.exif_datetime.substr(0, row.exif_datetime.indexOf(' '));
  return _.replace(onlyDay, /:/g, '-');
}

function preparePlotTrace(animalData: Observation[]) {
  const animalByDate = _.groupBy(animalData, getDateFromRow);
  return {
    x: _.keys(animalByDate),
    y: _.map(animalByDate, 'length'),
    type: 'scatter',
    name: animalData[1].pred_1
  };
}

function prepareDataForPlot(data: Observation[]) {
  const dataSorted = _.sortBy(data, 'exif_datetime');
  const groupAnimal = _.groupBy(dataSorted, 'pred_1');
  return _.map(groupAnimal, preparePlotTrace);
}

const selectorOptions = {
  buttons: [
    {
      step: 'month',
      stepmode: 'backward',
      count: 1,
      label: '1m'
    },
    {
      step: 'month',
      stepmode: 'backward',
      count: 6,
      label: '6m'
    },
    {
      step: 'year',
      stepmode: 'todate',
      count: 1,
      label: 'YTD'
    },
    {
      step: 'year',
      stepmode: 'backward',
      count: 1,
      label: '1y'
    },
    {
      step: 'all'
    }
  ]
};

export default function ExplorePage() {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState<string>();
  const [data, setData] = useState<undefined | Observation[]>();

  const dataForPlot = data !== undefined ? prepareDataForPlot(data) : undefined;

  const table = data && (
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

  const layout = {
    responsive: true,
    title: 'Animals count over time',
    hovermode: 'closest',
    xaxis: {
      rangeselector: selectorOptions,
      rangeslider: {}
    }
  };
  return (
    <div style={{ padding: '10px 30px', width: '100%', overflowY: 'scroll' }}>
      <h1>{t('Explore')}</h1>
      <div
        className="bp3-input-group"
        style={{ marginBottom: '10px', width: '60%' }}
      >
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
            chooseFile(setFilePath, setData);
          }}
        />
      </div>
      {filePath && (
        <div style={{ flex: 1, paddingBottom: '20px' }}>
          <Card interactive elevation={Elevation.TWO}>
            <h2 style={{ marginTop: 0 }}>{t('Filters')}</h2>
          </Card>
        </div>
      )}
      {filePath && (
        <div style={{ flex: 1, width: '100%', paddingBottom: '20px' }}>
          <Card interactive elevation={Elevation.TWO}>
            <Plot
              data={dataForPlot as any}
              useResizeHandler
              style={{ width: '100%' }}
              layout={layout as any}
            />
          </Card>
        </div>
      )}
      <div style={{ flex: 1, width: '100%', paddingBottom: '20px' }}>
        <Card interactive elevation={Elevation.TWO}>
          <Map />
        </Card>
      </div>
      {table}
    </div>
  );
}
