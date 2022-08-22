import { Button, Card, Elevation, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import path from 'path';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';

import { formatAnimalClassName } from '../constants/animalsClasses';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationCard.module.scss';

const cx = classNames.bind(styles);

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
  onPhotoClick: (cardIndex: number | null) => void;
  lastObservationIndex: number;
  observationIndex: number;
  isMaximized: boolean;
};

function ObservationCard(props: ObservationCardProps) {
  const {
    observation,
    predictionOverride,
    onPredictionOverride,
    onPhotoClick,
    lastObservationIndex,
    observationIndex,
    isMaximized,
  } = props;
  const { t } = useTranslation();
  const [slideDirection, setSlideDirection] = useState<string | null>(null);

  const topPrediction = {
    value: observation.pred_1,
    label: formatAnimalClassName(observation.pred_1),
  };

  const handlePredictionOverride = (newPrediction: CreatableOption | null) => {
    if (newPrediction === null || newPrediction.value !== topPrediction.value) {
      onPredictionOverride(observation.location, newPrediction);
    }
  };

  const handleNavigationClick = useCallback(
    (direction: string) => {
      let newIndex = null;
      if (direction === 'left') {
        newIndex = observationIndex > 0 ? observationIndex - 1 : lastObservationIndex;
      } else if (direction === 'right') {
        newIndex = observationIndex < lastObservationIndex ? observationIndex + 1 : 0;
      }
      onPhotoClick(newIndex);
      setSlideDirection(direction);
    },
    [lastObservationIndex, observationIndex, onPhotoClick]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handleNavigationClick('left');
          break;
        case 'ArrowRight':
          handleNavigationClick('right');
          break;
        case 'Escape':
          onPhotoClick(null);
          break;
        default:
          break;
      }
    };
    if (isMaximized) {
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
    return undefined;
  }, [handleNavigationClick, isMaximized, onPhotoClick]);

  const predictions = [
    [formatAnimalClassName(observation.pred_1), observation.score_1],
    [formatAnimalClassName(observation.pred_2), observation.score_2],
    [formatAnimalClassName(observation.pred_3), observation.score_3],
  ];

  const predictionsTable = (
    <table className={`${styles.predictionsTable} bp4-html-table bp4-html-table-condensed`}>
      <thead>
        <tr>
          <th>{t('explore.inspect.prediction')}</th>
          <th>{t('explore.inspect.probability')}</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map((i) => (
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
    <CreatableSelect
      value={predictionOverride || topPrediction}
      onChange={handlePredictionOverride}
      options={taxonOptions}
      isClearable={predictionOverride !== undefined}
      menuShouldScrollIntoView={false}
      className={styles.predictionOverride}
      menuPlacement="auto"
    />
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
  const navigation = (
    <nav className={styles.nav}>
      <Button
        className={cx({ arrow: true, left: true })}
        icon="chevron-left"
        large
        onClick={() => handleNavigationClick('left')}
      />
      <Button
        className={cx({ arrow: true, right: true })}
        icon="chevron-right"
        large
        onClick={() => handleNavigationClick('right')}
      />
    </nav>
  );
  const observationClass = cx({
    observation: true,
    maximized: isMaximized,
  });
  const photoClass = cx({
    photo: true,
    slideInFromLeft: slideDirection === 'left',
    slideInFromRight: slideDirection === 'right',
  });

  return (
    <div className={observationClass}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <div className={styles.body}>
          <div
            className={photoClass}
            onClick={() => onPhotoClick(isMaximized ? null : observationIndex)}
            aria-hidden="true"
          >
            <img
              className={styles.img}
              src={`file:${observation.location}`}
              alt={observation.pred_1}
            />
          </div>
          <div className={styles.data}>
            {predictionsTable}
            {photoDetails}
          </div>
          {isMaximized && navigation}
        </div>
        <div className={styles.header}>
          <Tooltip content={t('explore.inspect.overrideTooltip')} position="top" minimal>
            {predictionOverrideWidget}
          </Tooltip>
        </div>
      </Card>
    </div>
  );
}

ObservationCard.defaultProps = {
  predictionOverride: undefined,
};

export default ObservationCard;
