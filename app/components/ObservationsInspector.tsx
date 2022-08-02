import React from 'react';
import { Card, Classes, Drawer, Elevation, Position, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import path from 'path';
import CreatableSelect from 'react-select/creatable';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';

import { formatAnimalClassName } from '../constants/animalsClasses';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationsInspector.scss';

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
};

function ObservationCard(props: ObservationCardProps) {
  const { observation, predictionOverride, onPredictionOverride } = props;
  const { t } = useTranslation();

  const handlePredictionOverride = (newValue: CreatableOption | null) => {
    onPredictionOverride(observation.location, newValue);
  };

  const predictions = [
    [formatAnimalClassName(observation.pred_1), observation.score_1],
    [formatAnimalClassName(observation.pred_2), observation.score_2],
    [formatAnimalClassName(observation.pred_3), observation.score_3]
  ];

  const predictionsTable = (
    <table className="bp3-html-table bp3-html-table-condensed">
      <thead>
        <tr>
          <th>{t('explore.inspect.prediction')}</th>
          <th>{t('explore.inspect.probability')}</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map(i => (
          <tr key={i[0]}>
            <td>{i[0]}</td>
            <td>
              {((i[1] as number) * 100).toFixed(2)}
              &nbsp;%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const predictionOverrideWidget = (
    <Tooltip content={t('explore.inspect.overrideTooltip')} position={Position.RIGHT}>
      <div className={styles.predictionOverride}>
        <h4 className={styles.predictionLabel}>{t('explore.inspect.override')}</h4>
        <CreatableSelect
          name={predictionOverride}
          value={predictionOverride}
          onChange={handlePredictionOverride}
          isClearable
          options={taxonOptions}
          menuShouldScrollIntoView={false}
        />
      </div>
    </Tooltip>
  );
  const photoDetails = (
    <div className={styles.photoDetails}>
      <p>
        <strong>
          {t('explore.inspect.camera')}
          :&nbsp;
        </strong>
        {observation.camera}
      </p>
      <p>
        <strong>
          {t('explore.inspect.file')}
          :&nbsp;
        </strong>
        {path.basename(observation.location)}
      </p>
    </div>
  );

  return (
    <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
      <h3 className={styles.heading}>
        {t('explore.inspect.photoHeader', {
          species: formatAnimalClassName(
            predictionOverride ? predictionOverride.value : observation.pred_1
          ),
          date: observation.date
        })}
      </h3>
      <div className={styles.body}>
        <div>
          <img src={observation.location} width={400} alt={observation.pred_1} />
        </div>
        <div className={styles.data}>
          {predictionsTable}
          {predictionOverrideWidget}
          {photoDetails}
        </div>
      </div>
    </Card>
  );
}

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionOverride: PredictionOverrideHandler;
};

const LOADING = 1;
const LOADED = 2;
const itemStatusMap: number[] = [];

const isItemLoaded = (index: number) => !!itemStatusMap[index];
const loadMoreItems = (startIndex: number, stopIndex: number): Promise<void> => {
  for (let index = startIndex; index <= stopIndex; index += 1) {
    itemStatusMap[index] = LOADING;
  }
  return new Promise(resolve =>
    setTimeout(() => {
      for (let index = startIndex; index <= stopIndex; index += 1) {
        itemStatusMap[index] = LOADED;
      }
      resolve();
    }, 1000)
  );
};

type ObservationRowProps = {
  index: number;
  style: React.CSSProperties;
  data: {
    observations: Observation[];
    predictionOverrides: PredictionOverridesMap;
    onPredictionOverride: PredictionOverrideHandler;
  };
};

const ObservationRow = ({ index, style, data }: ObservationRowProps) => {
  const { observations, predictionOverrides, onPredictionOverride } = data;
  const observation = observations[index];

  if (observation === undefined) return false;
  return itemStatusMap[index] === LOADED ? (
    <div style={style}>
      <ObservationCard
        key={observation.location}
        observation={observation}
        predictionOverride={predictionOverrides[observation.location]}
        onPredictionOverride={onPredictionOverride}
      />
    </div>
  ) : (
    <div style={style}>Still loading</div>
  );
};

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionOverride } = props;
  const { t } = useTranslation();
  if (observations.length === 0) {
    return null;
  }
  return (
    <Drawer
      title={t('explore.inspect.header', {
        station: observations[0].station
      })}
      className={styles.drawer}
      icon="camera"
      isOpen={observations.length > 0}
      onClose={onClose}
      // Workaround: without this setting, clearning prediction override closes the drawer.
      canOutsideClickClose={false}
    >
      <div className={`${Classes.DRAWER_BODY} ${styles['drawer-body']}`}>
        <div className={`${Classes.DIALOG_BODY} ${styles['dialog-body']}`}>
          <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={650} loadMoreItems={loadMoreItems}>
            {/* The types here should work after installation */}
            {({ onItemsRendered, ref }: { onItemsRendered: () => {}; ref: (ref: {}) => void }) => (
              <AutoSizer>
                {({ height, width }: { height: number; width: number }) => (
                  <FixedSizeList
                    className="List"
                    height={height}
                    itemCount={observations.length}
                    itemData={{
                      observations,
                      predictionOverrides,
                      onPredictionOverride
                    }}
                    itemSize={380}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                    width={width}
                  >
                    {ObservationRow}
                  </FixedSizeList>
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER}>
        {t('explore.inspect.observations', {
          count: observations.length
        })}
      </div>
    </Drawer>
  );
}
