import { Card, Elevation, Position, Tooltip } from '@blueprintjs/core';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';

import { formatAnimalClassName } from '../constants/animalsClasses';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationCard.module.scss';

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
};

export default function ObservationCard(props: ObservationCardProps) {
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
      <CreatableSelect
        name={predictionOverride}
        value={predictionOverride || observation}
        onChange={handlePredictionOverride}
        isClearable
        options={taxonOptions}
        menuShouldScrollIntoView={false}
      />
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
        <div className={styles.body}>
          <div className={styles.photo}>
            <img className={styles.img} src={observation.location} alt={observation.pred_1} />
          </div>
          <div className={styles.data}>
            {predictionsTable}
            {photoDetails}
          </div>
        </div>
        <h5 className={styles.header}>
          <span className={styles.species}>{predictionOverrideWidget}</span>
          <span className={styles.date}>{observation.date}</span>
        </h5>
      </Card>
    </div>
  );
}
