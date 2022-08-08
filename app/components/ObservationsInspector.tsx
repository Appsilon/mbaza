import { Button, Card, Classes, Drawer, Elevation, Position, Tooltip } from '@blueprintjs/core';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import { Virtuoso } from 'react-virtuoso';

import { formatAnimalClassName } from '../constants/animalsClasses';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationsInspector.module.scss';

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
    <div className={styles.observation}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <h5 className={styles.heading}>
          {t('explore.inspect.photoHeader', {
            species: formatAnimalClassName(
              predictionOverride ? predictionOverride.value : observation.pred_1
            ),
            date: observation.date
          })}
        </h5>
        <div className={styles.body}>
          <div className={styles.photo}>
            <img
              className={styles.img}
              src={observation.location}
              width={360}
              alt={observation.pred_1}
            />
          </div>
          <div className={styles.data}>
            {predictionsTable}
            {predictionOverrideWidget}
            {photoDetails}
          </div>
        </div>
      </Card>
    </div>
  );
}

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionOverride: PredictionOverrideHandler;
};

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionOverride } = props;
  const { t } = useTranslation();
  if (observations.length === 0) {
    return null;
  }
  return (
    <Drawer
      className={styles.drawer}
      isOpen={observations.length > 0}
      onClose={onClose}
      // Workaround: without this setting, clearning prediction override closes the drawer.
      canOutsideClickClose={false}
      size="100%"
      transitionName="opacity"
      usePortal={false}
      hasBackdrop={false}
    >
      <div className={`${Classes.DRAWER_HEADER} ${styles.drawerHeader}`}>
        <Button
          className={styles.backButton}
          icon="chevron-left"
          minimal
          alignText="left"
          onClick={onClose}
          text={t('explore.backToMap')}
        />
        <h4 className={styles.heading}>
          {t('explore.inspect.header', {
            station: observations[0].station
          })}
        </h4>
      </div>
      <div className={`${Classes.DRAWER_BODY} ${styles.drawerBody}`}>
        <div className={`${Classes.DIALOG_BODY} ${styles.dialogBody}`}>
          <Virtuoso
            className={styles.list}
            data={observations}
            itemContent={(_index, observation) => (
              <ObservationCard
                observation={observation}
                predictionOverride={predictionOverrides[observation.location]}
                onPredictionOverride={onPredictionOverride}
              />
            )}
          />
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
