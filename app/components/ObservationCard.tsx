import { Card, Elevation, Position } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import classNames from 'classnames/bind';

import { formatAnimalClassName } from '../constants/animalsClasses';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationCard.module.scss';

const cx = classNames.bind(styles);

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
  onPhotoClick: (cardIndex: number | null) => void;
  observationIndex: number;
  isMaximized: boolean;
};

export default function ObservationCard(props: ObservationCardProps) {
  const {
    observation,
    predictionOverride,
    onPredictionOverride,
    onPhotoClick,
    observationIndex,
    isMaximized
  } = props;
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
    <table className={`${styles.predictionsTable} bp3-html-table bp3-html-table-condensed`}>
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
    <Tooltip2 content={t('explore.inspect.overrideTooltip')} position={Position.RIGHT}>
      <CreatableSelect
        name={predictionOverride}
        value={predictionOverride || observation}
        onChange={handlePredictionOverride}
        isClearable={predictionOverride}
        options={taxonOptions}
        menuShouldScrollIntoView={false}
        className={styles.predictionOverride}
        menuPlacement={isMaximized ? 'top' : 'bottom'}
      />
    </Tooltip2>
  );
  const photoDetail = (label: string, value: string) => (
    <p className={styles.photoDetail}>
      <span className={styles.label}>{`${t(`explore.inspect.${label}`)}: `}</span>
      <span>{value}</span>
    </p>
  );
  const photoDetails = (
    <div className={styles.photoDetails}>
      {photoDetail('date', observation.date)}
      {photoDetail('camera', observation.camera)}
      {photoDetail('file', path.basename(observation.location))}
    </div>
  );
  const observationClass = cx({
    observation: true,
    maximized: isMaximized
  });

  return (
    <div className={observationClass}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <div
          className={styles.body}
          onClick={() => onPhotoClick(isMaximized ? null : observationIndex)}
          aria-hidden="true"
        >
          <div className={styles.photo}>
            <img className={styles.img} src={observation.location} alt={observation.pred_1} />
          </div>
          <div className={styles.data}>
            {predictionsTable}
            {photoDetails}
          </div>
        </div>
        <h5 className={styles.header}>{predictionOverrideWidget}</h5>
      </Card>
    </div>
  );
}
