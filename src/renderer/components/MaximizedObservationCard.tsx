import { Button, Card, Elevation, Tooltip } from '@blueprintjs/core';
import path from 'path';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './MaximizedObservationCard.module.scss';
import { getPredictions, PhotoDetails, PredictionsTable } from './observationsHelpers';

export default function ObservationCard(props: MaximizedObservationCardProps) {
  const {
    observation,
    observationIndex,
    photosPath,
    onPhotoClick,
    onPrevious,
    onNext,
    overrideWidget,
  } = props;
  const { t } = useTranslation();
  const predictions = getPredictions(observation);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onPrevious(observationIndex);
          break;
        case 'ArrowRight':
          onNext(observationIndex);
          break;
        case 'Escape':
          onPhotoClick(null, false);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className={styles.observation}>
      <Card className={styles.card} elevation={Elevation.TWO} key={observation.location}>
        <div className={styles.body}>
          <div
            className={styles.photo}
            onClick={() => onPhotoClick(null, false)}
            aria-hidden="true"
          >
            <img
              className={styles.img}
              src={`file:${path.join(photosPath, observation.location)}`}
              alt={observation.pred_1}
            />
            <div className={styles.data}>
              <PredictionsTable predictions={predictions} maximized />
              <PhotoDetails observation={observation} maximized />
            </div>
          </div>
          <nav className={styles.nav}>
            <Button
              className={styles.arrow}
              icon="chevron-left"
              large
              onClick={() => onPrevious(observationIndex)}
            />
            <Button
              className={styles.arrow}
              icon="chevron-right"
              large
              onClick={() => onNext(observationIndex)}
            />
          </nav>
        </div>
        <div className={styles.header}>
          <Tooltip content={t('explore.inspect.override.tooltip')} position="top" minimal>
            {overrideWidget}
          </Tooltip>
        </div>
      </Card>
    </div>
  );
}
