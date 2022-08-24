import { Button, Card, Elevation, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import { getPredictions, getTopPrediction } from '../utils/observationsHelpers';
import styles from './ObservationCard.module.scss';
import { PhotoDetails, PredictionsTable } from './observationsComponents';

const cx = classNames.bind(styles);

type ObservationCardProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionsOverrideHandler;
  onPhotoClick: (cardIndex: number | null, cardSelected: boolean) => void;
  onCardSelect: (cardIndex: number, cardSelected: boolean) => void;
  lastObservationIndex: number;
  observationIndex: number;
  isMaximized: boolean;
  isSelected: boolean;
  isSelectionMode: boolean;
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

  const predictionOverrideWidget = (
    <CreatableSelect
      value={predictionOverride || topPrediction}
      onChange={handlePredictionOverride}
      options={taxonOptions}
      isDisabled={isSelected}
      isClearable={predictionOverride !== undefined}
      menuShouldScrollIntoView={false}
      menuPlacement="auto"
      className={styles.predictionOverride}
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
  const observationClass = cx({
    observation: true,
    maximized: isMaximized,
    selected: isSelected,
    selectable: isSelectionMode,
  });

  return (
    <div className={styles.observation}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <div
          className={styles.body}
          onClick={() => onPhotoClick(isMaximized ? null : observationIndex, !isSelected)}
          aria-hidden="true"
        >
          <div className={styles.photo}>
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
          <Button
            className={styles.selectButton}
            icon="tick-circle"
            minimal
            onClick={() => onCardSelect(observationIndex, !isSelected)}
          />
        </div>
      </Card>
    </div>
  );
}

ObservationCard.defaultProps = {
  predictionOverride: undefined,
};

export default ObservationCard;
