import { Button, Card, Elevation, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import path from 'path';
import { useTranslation } from 'react-i18next';

import styles from './ObservationCard.module.scss';
import { getPredictions, PhotoDetails, PredictionsTable } from './observationsHelpers';

const cx = classNames.bind(styles);

export default function ObservationCard(props: ObservationCardProps) {
  const {
    observation,
    observationIndex,
    isSelected,
    isSelectionMode,
    photosPath,
    onCardSelect,
    onPhotoClick,
    overrideWidget,
  } = props;
  const { t } = useTranslation();
  const predictions = getPredictions(observation);

  const observationClass = cx('observation', {
    selected: isSelected,
    selectable: isSelectionMode,
  });

  return (
    <div className={observationClass}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <div
          className={styles.body}
          onClick={() => onPhotoClick(observationIndex, !isSelected)}
          aria-hidden="true"
        >
          <div className={styles.photo}>
            <img
              className={styles.img}
              src={`file:${path.join(photosPath, observation.location)}`}
              alt={observation.pred_1}
            />
            <div className={styles.data}>
              <PredictionsTable predictions={predictions} maximized={false} />
              <PhotoDetails observation={observation} maximized={false} />
            </div>
          </div>
        </div>
        <div className={styles.header}>
          <Tooltip content={t('explore.inspect.override.tooltip')} position="top" minimal>
            {overrideWidget}
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
