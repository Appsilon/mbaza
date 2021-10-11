import React, { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Card,
  Elevation,
  Tab,
  Tabs,
  H1,
  Intent,
  Callout,
  NumberRange,
  Divider
} from '@blueprintjs/core';
import { remote } from 'electron';

import Map from '../components/Map';
import ObservationsTable from '../components/ObservationsTable';
import ExplorerFilter from '../components/explorerFilters';
import ExplorerMetrics from '../components/explorerMetrics';
import {
  formatAnimalClassName,
  EmptyClasses,
  RareAnimalsClasses
} from '../constants/animalsClasses';
import ObservationsInspector from '../components/ObservationsInspector';
import showSaveCsvDialog from '../utils/showSaveCsvDialog';
import writeCorrectedCsv from '../utils/writeCorrectedCsv';
import readObservationsCsv from '../utils/readObservationsCsv';
import Databar from '../components/explorerDatabar';

type Filters = {
  activeAnimals: Entry[];
  activeCameras: Entry[];
  activeStations: Entry[];
  activeChecks: Entry[];
  certaintyRange: NumberRange;
};

type Entry = {
  label: string;
  value: string;
};

const initialFilters: Filters = {
  activeAnimals: [],
  activeCameras: [],
  activeStations: [],
  activeChecks: [],
  certaintyRange: [0, 1]
};

async function chooseFile(
  changeFileChoice: (path: string) => void,
  setObservations: (observations: Observation[]) => void
) {
  const dialog = await remote.dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'CSV', extensions: ['csv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (!dialog.canceled) {
    const path = dialog.filePaths[0];
    const observations = await readObservationsCsv(path);
    changeFileChoice(path);
    setObservations(observations);
    return observations;
  }
  return undefined;
}

function inRange(value: number, [low, high]: NumberRange) {
  return low <= value && value <= high;
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState<string>();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [observations, setObservations] = useState<undefined | Observation[]>();
  const [inspectedObservations, setInspectedObservations] = useState<Observation[]>([]);
  const [predictionOverrides, setPredictionOverrides] = useState<PredictionOverridesMap>({});

  const handleFilters = (val: string[]) => {
    setFilters({ ...filters, ...val });
  };

  const handlePredictionOverride = (location: string, override: CreatableOption | null) => {
    if (observations === undefined) return false;
    const overrides = { ...predictionOverrides };
    const observationIndex: number = observations.findIndex(obs => obs.location === location);
    const observation = observations[observationIndex];

    if (override === null) {
      delete overrides[location];
    } else {
      overrides[location] = override;
    }
    observations[observationIndex] = {
      ...observation,
      label: override === null ? observation.pred_1 : override.value
    };
    setPredictionOverrides(overrides);
    return false;
  };

  const handleNewDataImport = async () => {
    const newObservations = await chooseFile(setFilePath, setObservations);
    const overrides = detectOverrides(newObservations);
    setPredictionOverrides(overrides);
    setFilters(initialFilters);
  };

  const filterCondition = (needle: string, haystack: Entry[]) => {
    if (haystack.length === 0) return true;
    return haystack.map(entry => entry.value).includes(needle);
  };

  const filteredData = useMemo(() => {
    let filtered = observations === undefined ? [] : observations;
    if (filters !== undefined) {
      filtered = filtered.filter(
        (entry: Observation) =>
          filterCondition(entry.pred_1, filters.activeAnimals) &&
          filterCondition(entry.camera, filters.activeCameras) &&
          filterCondition(entry.station, filters.activeStations) &&
          filterCondition(entry.check, filters.activeChecks) &&
          inRange(entry.score_1, filters.certaintyRange)
      );
    }
    return { observations: filtered };
  }, [filters, observations]);

  const mainPanel = (
    <Card style={{ height: '100%' }} interactive elevation={Elevation.TWO}>
      <Callout intent={Intent.PRIMARY}>{t('explore.mapHint')}</Callout>
      <div
        style={{
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Map observations={filteredData.observations} onInspect={setInspectedObservations} />
        <ObservationsInspector
          observations={inspectedObservations}
          onClose={() => setInspectedObservations([])}
          predictionOverrides={predictionOverrides}
          onPredictionOverride={handlePredictionOverride}
        />
      </div>
    </Card>
  );

  const countOverrides = (obs: Observation[]): number => {
    return obs.reduce((a, b) => a + (b.pred_1 !== b.label ? 1 : 0), 0);
  };
  const overridesTotal = observations ? countOverrides(observations) : 0;

  if (observations !== undefined) {
    const handleCsvExport = () => {
      const callback = (path: string) => {
        writeCorrectedCsv(path, observations, predictionOverrides);
      };
      showSaveCsvDialog('classification_result_corrected.csv', callback);
    };
    const handleEvents = () => {
      // TODO (Kamil): implement events handler
      console.log('events handler triggered');
    };

    return (
      <div
        style={{
          padding: '30px 30px',
          width: '100%',
          overflowY: 'scroll',
          maxHeight: 'calc(100vh - 50px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <Databar
          filePath={filePath}
          onDataImportClick={() => setObservations(undefined)}
          onEventsUpdateClick={handleEvents}
          onDataExportClick={handleCsvExport}
        />
        <Divider />
        <ExplorerFilter observations={observations} updateFilters={handleFilters} />
        <Divider />
        <ExplorerMetrics
          data={filteredData.observations}
          rareTargets={RareAnimalsClasses}
          emptyClasses={EmptyClasses}
          overridesTotal={overridesTotal}
        />
        <Tabs renderActiveTabPanelOnly>
          <Tab id="main" title={t('explore.mapView')} panel={mainPanel} />
          <Tab
            id="table"
            title={t('explore.tableView')}
            panel={<ObservationsTable observations={filteredData.observations} />}
          />
          <Tabs.Expander />
        </Tabs>
      </div>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <Card elevation={Elevation.TWO}>
            <H1>{t('explore.chooseFile')}</H1>
            <div className="bp3-input-group" style={{ width: '60%' }}>
              <input
                type="text"
                className="bp3-input"
                placeholder={t('explore.chooseFile')}
                value={filePath || ''}
                onChange={e => {
                  setFilePath(e.target.value);
                }}
              />
              <button
                aria-label="Search"
                type="submit"
                className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-search"
                onClick={handleNewDataImport}
              />
            </div>
          </Card>
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <Callout intent={Intent.PRIMARY}>
            <Trans i18nKey="explore.info" />
          </Callout>
        </div>
      </div>
    </div>
  );
}
