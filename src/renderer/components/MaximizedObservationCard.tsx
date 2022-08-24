import { Button, Card, Elevation, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ObservationCard.module.scss';
import { getPredictions, PhotoDetails, PredictionsTable } from './observationsHelpers';

const cx = classNames.bind(styles);

export default function ObservationCard(props: MaximizedObservationCardProps) {
  const {
    observation,
    observationIndex,
    onPhotoClick,
    lastObservationIndex,
    predictionOverrideWrapper: PredictionOverrideWrapper,
  } = props;
  const { t } = useTranslation();
  const predictions = getPredictions(observation);

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
            <PredictionOverrideWrapper />
          </Tooltip>
        </div>
      </Card>
    </div>
  );
}
