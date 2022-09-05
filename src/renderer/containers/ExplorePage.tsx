import {
  Button,
  Callout,
  Card,
  Elevation,
  H4,
  Icon,
  Intent,
  NumberRange,
  Tooltip,
} from '@blueprintjs/core';
import { csvFormat } from 'd3-dsv';
import { promises as fsPromises } from 'fs';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ExploreHeader from '../components/ExploreHeader';
import ExplorerFilter from '../components/ExplorerFilters';
import ExplorerMetrics from '../components/ExplorerMetrics';
import Map from '../components/Map';
import ObservationsInspector from '../components/ObservationsInspector';
import PathInput from '../components/PathInput';
import {
  EmptyClasses,
  formatAnimalClassName,
  RareAnimalsClasses,
} from '../constants/animalsClasses';
import computeEvents from '../utils/computeEvents';
import exportDarwinCore from '../utils/exportDarwinCore';
import exportPhotos from '../utils/exportPhotos';
import { openCsvDialog, openDirectoryDialog, saveCsvDialog } from '../utils/fileDialog';
import readObservationsCsv from '../utils/readObservationsCsv';
import writeCorrectedCsv from '../utils/writeCorrectedCsv';
import styles from './ExplorePage.module.scss';

import animals1 from '../../../assets/graphics/SVG_1.svg';
import animals2 from '../../../assets/graphics/SVG_2.svg';
import animals3 from '../../../assets/graphics/SVG_3.svg';
import animals4 from '../../../assets/graphics/SVG_4.svg';
import animals5 from '../../../assets/graphics/SVG_5.svg';
import animals6 from '../../../assets/graphics/SVG_6.svg';

const { writeFile } = fsPromises;
const animalsBackgrounds = [animals6, animals5, animals4, animals3, animals2, animals1];

type Filters = {
  activeAnimals: Entry[];
  activeCameras: Entry[];
  activeStations: Entry[];
  certaintyRange: NumberRange;
};

const initialFilters: Filters = {
  activeAnimals: [],
  activeCameras: [],
  activeStations: [],
  certaintyRange: [0, 1],
};

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
          value: formatAnimalClassName(observation.label),
        };
      });
    return override;
  }
  return {};
}

function eventsCount(observations: Observation[]): number {
  return _(observations).map('event_id').without(undefined).uniq().size();
}

function missingEvents(observations: Observation[]): number {
  return _(observations).map('event_id').filter(_.isUndefined).size();
}

function overridesCount(observations: Observation[]): number {
  return observations.reduce((a, b) => a + (b.pred_1 !== b.label ? 1 : 0), 0);
}
function formatLabel(label: string): string {
  if (label) return label.replace(/_/g, ' ');
  return '<?>';
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [csvPath, setCsvPath] = useState<string>('');
  const [photosPath, setPhotosPath] = useState<string>('');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [observations, setObservations] = useState<undefined | Observation[]>();
  const [isInspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [predictionOverrides, setPredictionOverrides] = useState<PredictionOverridesMap>({});

  const handleFilters = (val: string[] | Entry[]) => {
    setFilters({ ...filters, ...val });
  };

  const handlePredictionsOverride = (locations: string[], override: CreatableOption | null) => {
    if (observations === undefined) return;
    const updatedOverrides = { ...predictionOverrides };
    const updatedObservations = [...observations];

    locations.forEach((location) => {
      const observationIndex: number = updatedObservations.findIndex(
        (observation) => observation.location === location
      );
      const observation = updatedObservations[observationIndex];

      if (override === null) {
        delete updatedOverrides[location];
      } else {
        updatedOverrides[location] = override;
      }
      updatedObservations[observationIndex] = {
        ...observation,
        label: override === null ? observation.pred_1 : override.value,
      };
    });
    setObservations(updatedObservations);
    setPredictionOverrides(updatedOverrides);
  };

  const handleNewDataImport = async () => {
    const newObservations = await readObservationsCsv(csvPath);
    if (newObservations) {
      setObservations(newObservations);
      const overrides = detectOverrides(newObservations);
      setPredictionOverrides(overrides);
      setFilters(initialFilters);
    }
  };

  const filterCondition = (needle: string, haystack: Entry[]) => {
    if (haystack.length === 0) return true;
    return haystack.map((entry) => entry.value).includes(needle);
  };

  const filteredObservations = useMemo(() => {
    let filtered = observations === undefined ? [] : observations;
    if (filters !== undefined) {
      filtered = filtered.filter(
        (entry: Observation) =>
          filterCondition(entry.label, filters.activeAnimals) &&
          filterCondition(entry.camera, filters.activeCameras) &&
          filterCondition(entry.station, filters.activeStations) &&
          inRange(entry.uncertainty, filters.certaintyRange)
      );
    }
    return filtered;
  }, [filters, observations]);

  if (observations !== undefined) {
    const handleCsvExport = async () => {
      const path = await saveCsvDialog('classification_result');
      if (path !== undefined) {
        writeCorrectedCsv(path, observations, predictionOverrides);
      }
    };
    const handleEventsUpdate = (evtMaxDuration: number | undefined) => {
      const newObservations = computeEvents({ minutes: evtMaxDuration }, observations);
      setObservations(newObservations);
    };
    const handleDarwinCoreExport = async () => {
      if (missingEvents(observations) > 0) {
        // eslint-disable-next-line no-alert
        alert(t('explore.missingEvents'));
        return;
      }
      const path = await saveCsvDialog('darwin_core');
      if (path !== undefined) {
        const darwinCore = csvFormat(exportDarwinCore(observations));
        await writeFile(path, darwinCore);
      }
    };
    const handlePhotosExport = async () => {
      const path = await openDirectoryDialog();
      if (path !== undefined) await exportPhotos(path, filteredObservations, photosPath);
    };
    const handleInspector = (observations, station) => {
      handleFilters({
        activeStations: [{ value: station, label: formatLabel(station) }],
      });
      setInspectorOpen(true);
    };

    return (
      <div className={styles.containerLoaded}>
        <ExploreHeader
          filePath={csvPath}
          onDataImportClick={() => setObservations(undefined)}
          onEventsUpdateClick={handleEventsUpdate}
          onDataExportClick={handleCsvExport}
          onDarwinCoreExportClick={handleDarwinCoreExport}
          onPhotosExportClick={handlePhotosExport}
        />
        <ExplorerFilter
          observations={observations}
          updateFilters={handleFilters}
          activeStations={filters.activeStations}
        />
        <ExplorerMetrics
          data={filteredObservations}
          rareTargets={RareAnimalsClasses}
          emptyClasses={EmptyClasses}
          overridesTotal={overridesCount(filteredObservations)}
          eventsTotal={eventsCount(filteredObservations)}
        />
        <Card className={styles.card} elevation={Elevation.TWO}>
          <Callout intent={Intent.PRIMARY}>{t('explore.mapHint')}</Callout>
          <div className={styles.cardBody}>
            <Map
              observations={filteredObservations}
              onInspect={handleInspector}
              photosPath={photosPath}
            />
            {isInspectorOpen && (
              <ObservationsInspector
                observations={filteredObservations}
                onClose={() => setInspectorOpen(false)}
                predictionOverrides={predictionOverrides}
                onPredictionsOverride={handlePredictionsOverride}
                photosPath={photosPath}
              />
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card} elevation={Elevation.TWO}>
        <div className={styles.header}>
          <H4 className={styles.title}>{t('explore.specifyPaths')}</H4>
          <Tooltip content={t('explore.info')}>
            <Icon className={styles.icon} color="#647f80" icon="help" iconSize={22} />
          </Tooltip>
        </div>
        <PathInput
          className={styles.pathInput}
          placeholder={t('explore.specifyCsvFilePath')}
          value={csvPath}
          onChange={setCsvPath}
          showDialog={openCsvDialog}
        />
        <PathInput
          className={styles.pathInput}
          placeholder={t('explore.specifyDatabaseDirectory')}
          value={photosPath}
          onChange={setPhotosPath}
          showDialog={openDirectoryDialog}
        />
        <Button
          aria-label="Confirm"
          intent="primary"
          fill
          large
          disabled={!csvPath || !photosPath}
          onClick={handleNewDataImport}
          text={t('explore.exploreResults')}
          type="submit"
        />
      </Card>
      <div className={styles.animals}>
        {animalsBackgrounds.map((background, index) => (
          <img src={background} key={background} alt={`animal_${index}`} />
        ))}
      </div>
    </div>
  );
}
