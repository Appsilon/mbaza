import { Card, Elevation, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import { getPredictions, getTopPrediction } from '../utils/observationsHelpers';
import styles from './ObservationCard.module.scss';
import { PhotoDetails, PredictionsTable } from './observationsComponents';

const cx = classNames.bind(styles);

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
  onPhotoClick: (cardIndex: number | null) => void;
  observationIndex: number;
};

function ObservationCard(props: ObservationCardProps) {
  const {
    observation,
    predictionOverride,
    onPredictionOverride,
    onPhotoClick,
    observationIndex,
    predictionOverrideWrapper: PredictionOverrideWrapper,
  } = props;
  const { t } = useTranslation();
  const predictions = getPredictions(observation);

  return (
    <div className={styles.observation}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <div className={styles.body}>
          <div
            className={styles.photo}
            onClick={() => onPhotoClick(observationIndex)}
            aria-hidden="true"
          >
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
        </div>
        <div className={styles.header}>
          <Tooltip content={t('explore.inspect.overrideTooltip')} position="top" minimal>
            <PredictionOverrideWrapper />
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
