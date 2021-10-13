import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  Card,
  Elevation,
  H4,
  Button,
  Intent,
  Callout,
  NumberRange,
  Divider,
  Tooltip,
  Icon
} from '@blueprintjs/core';
import { remote } from 'electron';

import Map from '../components/Map';
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
import ExploreHeader from '../components/ExploreHeader';
import computeEvents from '../utils/computeEvents';
import s from './ExplorePage.scss';

import animals1 from '../assets/graphics/SVG_1.svg';
import animals2 from '../assets/graphics/SVG_2.svg';
import animals3 from '../assets/graphics/SVG_3.svg';
import animals4 from '../assets/graphics/SVG_4.svg';
import animals5 from '../assets/graphics/SVG_5.svg';
import animals6 from '../assets/graphics/SVG_6.svg';

const animalsBackgrounds = [animals6, animals5, animals4, animals3, animals2, animals1];

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

function detectOverrides(observations: Observation[] | undefined) {
  if (observations !== undefined) {
    const override: PredictionOverridesMap = {};
    observations
      .filter((observation: Observation) => observation.label !== observation.pred_1)
      .forEach((observation: Observation) => {
        override[observation.location] = {
          label: formatAnimalClassName(observation.label),
          value: formatAnimalClassName(observation.label)
        };
      });
    return override;
  }
  return {};
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

  const eventsCount = _(filteredData.observations)
    .map('event_id')
    .without(undefined)
    .uniq()
    .size();

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
    const handleEventsUpdate = (evtMaxDuration: number | undefined) => {
      const newObservations = computeEvents({ minutes: evtMaxDuration }, observations);
      setObservations(newObservations);
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
        <ExploreHeader
          filePath={filePath}
          onDataImportClick={() => setObservations(undefined)}
          onEventsUpdateClick={handleEventsUpdate}
          onDataExportClick={handleCsvExport}
        />
        <Divider />
        <ExplorerFilter observations={observations} updateFilters={handleFilters} />
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
      </div>
    );
  }

  return (
    <div className={s.container}>
      <Card className={s.card} elevation={Elevation.TWO}>
        <div className={s.header}>
          <H4 className={s.title}>{t('explore.chooseFile')}</H4>
          <Tooltip content={t('explore.info')}>
            <Icon className={s.icon} color="#647f80" icon="help" iconSize={22} />
          </Tooltip>
        </div>
        <Button
          aria-label="Search"
          intent="primary"
          fill
          large
          onClick={handleNewDataImport}
          text={t('explore.chooseFilePlaceholder')}
          type="submit"
        />
      </Card>
      <div className={s.animals}>
        {animalsBackgrounds.map((background, index) => (
          <img src={background} key={background} alt={`animal_${index}`} />
        ))}
      </div>
    </div>
  );
}
