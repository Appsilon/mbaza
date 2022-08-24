import { Card, Elevation, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';

import { PredictionsTable, PhotoDetails } from './observationsComponents';
import { getPredictions, getTopPrediction } from '../utils/observationsHelpers';
import { taxonOptions } from '../constants/taxons';
import styles from './ObservationCard.module.scss';

const cx = classNames.bind(styles);

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
  onPhotoClick: (cardIndex: number | null) => void;
  observationIndex: number;
};

function ObservationCard(props: ObservationCardProps) {
  const { observation, predictionOverride, onPredictionOverride, onPhotoClick, observationIndex } =
    props;
  const { t } = useTranslation();
  const topPrediction = getTopPrediction(observation);
  const predictions = getPredictions(observation);

  const handlePredictionOverride = (newPrediction: CreatableOption | null) => {
    if (newPrediction === null || newPrediction.value !== topPrediction.value) {
      onPredictionOverride(observation.location, newPrediction);
    }
  };

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
