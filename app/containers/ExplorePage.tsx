import React, { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Card,
  Elevation,
  Button,
  Tab,
  Tabs,
  H1,
  Intent,
  Callout,
  NumberRange,
  IconName,
  Tooltip
} from '@blueprintjs/core';

import Map from '../components/Map';
import ObservationsTable from '../components/ObservationsTable';
import ExplorerFilter from '../components/explorerFilters';
import ExplorerMetrics from '../components/explorerMetrics';
import { EmptyClasses, RareAnimalsClasses } from '../constants/animalsClasses';
import ObservationsInspector from '../components/ObservationsInspector';
import showSaveCsvDialog from '../utils/showSaveCsvDialog';
import writeCorrectedCsv from '../utils/writeCorrectedCsv';
import readObservationsCsv from '../utils/readObservationsCsv';

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

function chooseFile(
  changeFileChoice: (path: string) => void,
  setObservations: (observations: Observation[]) => void
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
    .then(filePath => {
      if (filePath !== undefined) {
        return readObservationsCsv(filePath);
      }
      return undefined;
    })
    .then(observations => {
      if (observations !== undefined) {
        setObservations(observations);
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

function inRange(value: number, [low, high]: NumberRange) {
  return low <= value && value <= high;
}

type DataButtonProps = {
  onClick: () => void;
  textTop: string;
  textBottom: string;
  icon: IconName;
};

function DataButton({ textTop, textBottom, icon, onClick }: DataButtonProps) {
  return (
    <Card
      style={{
        padding: '0',
        display: 'inline-flex',
        flexDirection: 'column',
        height: '100px',
        marginRight: '20px'
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
          {textTop}
        </span>
      </div>
      <Button
        text={textBottom}
        icon={icon}
        onClick={onClick}
        style={{
          backgroundColor: '#fff',
          width: '100%',
          height: '30px',
          textAlign: 'center',
          lineHeight: '1.4'
        }}
      />
    </Card>
  );
}

export default function ExplorePage() {
  const { t } = useTranslation();
  const [filePath, setFilePath] = useState<string>();
  const [filters, setFilters] = useState<Filters>({
    activeAnimals: [],
    activeCameras: [],
    activeStations: [],
    activeChecks: [],
    certaintyRange: [0, 1]
  });
  const [observations, setObservations] = useState<undefined | Observation[]>();
  const [inspectedObservations, setInspectedObservations] = useState<Observation[]>([]);
  const [predictionOverrides, setPredictionOverrides] = useState<PredictionOverridesMap>({});

  const handleFilters = (val: string[]) => {
    setFilters({ ...filters, ...val });
  };

  const handlePredictionOverride = (location: string, override: CreatableOption | null) => {
    const overrides = { ...predictionOverrides };
    if (override === null) {
      delete overrides[location];
    } else {
      overrides[location] = override;
    }
    setPredictionOverrides(overrides);
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

  // eslint-disable-next-line
  const filename = (filePath !== undefined) ? filePath.replace(/^.*[\\\/]/, '') : "";

  if (observations !== undefined) {
    const handleCsvExport = () => {
      const callback = (path: string) => {
        writeCorrectedCsv(path, observations, predictionOverrides);
      };
      showSaveCsvDialog('classification_result_corrected.csv', callback);
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
        <div style={{ display: 'flex' }}>
          <DataButton
            onClick={() => setObservations(undefined)}
            textTop={filename}
            textBottom={t('explore.changeFile')}
            icon="arrow-left"
          />
          <Tooltip content={t('explore.overridesTooltip')}>
            <DataButton
              onClick={handleCsvExport}
              textTop={t('explore.overrides', {
                count: Object.keys(predictionOverrides).length
              })}
              textBottom={t('explore.overridesExport')}
              icon="export"
            />
          </Tooltip>
          <ExplorerMetrics
            data={filteredData.observations}
            rareTargets={RareAnimalsClasses}
            emptyClasses={EmptyClasses}
          />
        </div>
        <ExplorerFilter observations={observations} updateFilters={handleFilters} />
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
                onClick={() => {
                  chooseFile(setFilePath, setObservations);
                }}
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
