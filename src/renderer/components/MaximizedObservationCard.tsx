import { Button, Card, Elevation, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';

import { taxonOptions } from '../constants/taxons';
import { getPredictions, getTopPrediction } from '../utils/observationsHelpers';
import styles from './ObservationCard.module.scss';
import { PhotoDetails, PredictionsTable } from './observationsComponents';

const cx = classNames.bind(styles);

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
  onPhotoClick: (cardIndex: number | null) => void;
  lastObservationIndex: number;
  observationIndex: number;
};

function ObservationCard(props: ObservationCardProps) {
  const {
    observation,
    predictionOverride,
    onPredictionOverride,
    onPhotoClick,
    lastObservationIndex,
    observationIndex,
  } = props;
  const { t } = useTranslation();
  const topPrediction = getTopPrediction(observation);
  const predictions = getPredictions(observation);

  const handlePredictionOverride = (newPrediction: CreatableOption | null) => {
    if (newPrediction === null || newPrediction.value !== topPrediction.value) {
      onPredictionOverride(observation.location, newPrediction);
    }
  };

  const handleNavigationClick = (direction: string) => {
    let newIndex = null;
    if (direction === 'left') {
      newIndex = observationIndex > 0 ? observationIndex - 1 : lastObservationIndex;
    } else if (direction === 'right') {
      newIndex = observationIndex < lastObservationIndex ? observationIndex + 1 : 0;
    }
    onPhotoClick(newIndex);
  };

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
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const navigation = (
    <nav className={styles.nav}>
      <Button
        className={styles.arrow}
        icon="chevron-left"
        large
        onClick={() => handleNavigationClick('left')}
      />
      <Button
        className={styles.arrow}
        icon="chevron-right"
        large
        onClick={() => handleNavigationClick('right')}
      />
    </nav>
  );

  return (
    <div className={cx('observation', 'maximized')}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <div className={styles.body}>
          <div className={styles.photo} onClick={() => onPhotoClick(null)} aria-hidden="true">
            <img
              className={styles.img}
              src={`file:${observation.location}`}
              alt={observation.pred_1}
            />
          </div>
          <div className={styles.data}>
            <PredictionsTable predictions={predictions} className={styles.predictionsTable} />
            <PhotoDetails observation={observation} styles={styles} />
          </div>
          {navigation}
        </div>
        <div className={styles.header}>
          <Tooltip content={t('explore.inspect.overrideTooltip')} position="top" minimal>
            <CreatableSelect
              value={predictionOverride || topPrediction}
              onChange={handlePredictionOverride}
              options={taxonOptions}
              isClearable={predictionOverride !== undefined}
              menuShouldScrollIntoView={false}
              className={styles.predictionOverride}
              menuPlacement="auto"
            />
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
