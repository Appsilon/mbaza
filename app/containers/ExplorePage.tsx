import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { csv } from 'd3-fetch';
import { Card, Elevation, Button, Tab, Tabs } from '@blueprintjs/core';
import Map from '../components/Map';
import AnimalsPlot from '../components/AnimalsPlot';
import ObservationsTable from '../components/ObservationsTable';
import ExplorerFilter from '../components/explorerFilters';
import ExplorerMetrics from '../components/explorerMetrics';

type filters = {
  activeAnimals: entry[];
  activeCameras: entry[];
  activeStations: entry[];
  activeChecks: entry[];
};

type entry = {
  label: string;
  value: string;
};

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
      // eslint-disable-next-line no-console
      console.log(error);
      // eslint-disable-next-line no-alert
      alert(error);
    });
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState<string>();
  const [filters, setFilters] = useState<filters>({
    activeAnimals: [],
    activeCameras: [],
    activeStations: [],
    activeChecks: []
  });
  const [data, setData] = useState<undefined | ObservationsData>();
  const handleFilters = (val: string[]) => {
    setFilters({ ...filters, ...val });
  };

  const filterCondition = (needle: string, haystack: entry[]) => {
    if (haystack.length === 0) return true;
    return haystack.map(entry => entry.value).includes(needle);
  };

  const getFilteredData = (options: undefined | ObservationsData) => {
    let filtered = typeof options !== 'undefined' ? options.observations : [];

    if (typeof filters !== 'undefined') {
      filtered = filtered.filter(
        (entry: Observation) =>
          filterCondition(entry.pred_1, filters.activeAnimals) &&
          filterCondition(entry.camera, filters.activeCameras) &&
          filterCondition(entry.station, filters.activeStations) &&
          filterCondition(entry.check, filters.activeChecks)
      );
    }
    return { observations: filtered };
  };

  const MainPanel: React.SFC = () => (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          flex: '1',
          width: '55%',
          paddingBottom: '20px',
          marginRight: '10px'
        }}
      >
        <Card style={{ height: '100%' }} interactive elevation={Elevation.TWO}>
          <AnimalsPlot data={getFilteredData(data)} />
        </Card>
      </div>
      <div
        style={{
          flex: '1',
          width: '45%',
          paddingBottom: '20px',
          marginLeft: '10px'
        }}
      >
        <Card style={{ height: '100%' }} interactive elevation={Elevation.TWO}>
          <Map data={getFilteredData(data)} />
        </Card>
      </div>
    </div>
  );
  const TablePanel: React.SFC = () => (
    <ObservationsTable data={getFilteredData(data)} />
  );

  // eslint-disable-next-line
  const filename = (filePath !== undefined) ? filePath.replace(/^.*[\\\/]/, '') : "";

  const contents =
    data !== undefined ? (
      <>
        <Card
          style={{
            position: 'absolute',
            padding: '0',
            display: 'inline-flex',
            flexDirection: 'column'
          }}
          interactive
          elevation={Elevation.TWO}
        >
          <div
            style={{
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#4e5e6b',
              color: 'white',
              minWidth: '150px',
              maxWidth: '200px',
              height: '70px',
              fontWeight: 'bold'
            }}
          >
            <span
              style={{
                wordWrap: 'break-word',
                width: '100%',
                textAlign: 'center'
              }}
            >
              {filename}
            </span>
          </div>
          <Button
            text={t('Change data')}
            icon="arrow-left"
            onClick={() => setData(undefined)}
            style={{
              backgroundColor: '#fff',
              width: '100%',
              height: '30px',
              textAlign: 'center',
              lineHeight: '1.4'
            }}
          />
        </Card>
        <ExplorerMetrics
          data={getFilteredData(data).observations}
          rareTargets={['Cat_Golden', 'Duiker_Red', 'Civet_African_Palm']}
        />
        <ExplorerFilter data={data} updateFilters={handleFilters} />
        <Tabs renderActiveTabPanelOnly>
          <Tab id="main" title={t('Main Information')} panel={<MainPanel />} />
          <Tab
            id="table"
            title={t('Observations Table')}
            panel={<TablePanel />}
          />
          <Tabs.Expander />
        </Tabs>
      </>
    ) : (
      <>
        <div className="bp3-input-group" style={{ width: '60%' }}>
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
    <div
      style={{
        padding: '30px 30px',
        width: '100%',
        overflowY: 'scroll',
        maxHeight: 'calc(100vh - 50px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {contents}
    </div>
  );
}
