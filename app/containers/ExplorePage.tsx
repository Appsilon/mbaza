import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { csv } from 'd3-fetch';
import { Card, Elevation, Button } from '@blueprintjs/core';
import Map from '../components/Map';
import AnimalsPlot from '../components/AnimalsPlot';
import ObservationsTable from '../components/ObservationsTable';

function chooseFile(
  changeFileChoice: (path: string) => void,
  setData: (data: ObservationsData) => void
) {
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
        setData({ observations: (data as unknown) as Observation[] });
        return data;
      }
      return undefined;
    })
    .catch(error => {
      // eslint-disable-next-line no-alert
      console.log(error);
      alert(error);
    });
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState<string>();
  const [data, setData] = useState<undefined | ObservationsData>();

  const contents =
    data !== undefined ? (
      <>
        <h1>{t('Explore')}</h1>
        <Button
          text={t('Back')}
          icon="arrow-left"
          onClick={() => setData(undefined)}
          style={{ marginBottom: '10px', backgroundColor: '#fff' }}
        />
        {/* <div style={{ flex: 1, paddingBottom: '20px' }}>
          <Card interactive elevation={Elevation.TWO}>
            <h2 style={{ marginTop: 0 }}>{t('Filters')}</h2>
          </Card>
        </div> */}
        <div style={{ flex: 1, width: '100%', paddingBottom: '20px' }}>
          <Card interactive elevation={Elevation.TWO}>
            <AnimalsPlot data={data} />
          </Card>
        </div>
        ,
        <div style={{ flex: 1, width: '100%', paddingBottom: '20px' }}>
          <Card interactive elevation={Elevation.TWO}>
            <Map data={data} />
          </Card>
        </div>
        <ObservationsTable data={data} />
      </>
    ) : (
      <>
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
      </>
    );

  return (
    <div style={{ padding: '10px 30px', width: '100%', overflowY: 'scroll' }}>
      {contents}
    </div>
  );
}
