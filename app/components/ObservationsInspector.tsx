import { Button } from '@blueprintjs/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VirtuosoGrid } from 'react-virtuoso';

import ObservationCard from './ObservationCard';
import styles from './ObservationsInspector.module.scss';

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionOverride: PredictionOverrideHandler;
  onPhotoClick?: (cardIndex: number) => void;
};

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionOverride } = props;
  const { t } = useTranslation();
  const [maximizedCardIndex, setMaximizedCardIndex] = useState<number | null>(null);
  const isMaximizedMode = maximizedCardIndex !== null;
  const backButtonText = t(`explore.${isMaximizedMode ? 'backToObservations' : 'backToMap'}`);
  const onBackButtonClick = () => (isMaximizedMode ? setMaximizedCardIndex(null) : onClose());

  return (
    <div className={styles.box}>
      <div className={styles.boxHeader}>
        <Button
          className={styles.backButton}
          icon="chevron-left"
          minimal
          alignText="left"
          onClick={onBackButtonClick}
          text={backButtonText}
        />
        <h4 className={styles.heading}>
          {t('explore.inspect.header', { station: observations[0].station })}
        </h4>
        <p className={styles.counter}>
          {t('explore.inspect.observations', { count: observations.length })}
        </p>
      </div>
      <div className={styles.boxBody}>
        <VirtuosoGrid
          totalCount={observations.length}
          listClassName={styles.list}
          itemContent={index => (
            <ObservationCard
              observation={observations[index]}
              predictionOverride={predictionOverrides[observations[index].location]}
              onPredictionOverride={onPredictionOverride}
              onPhotoClick={setMaximizedCardIndex}
              observationIndex={index}
              isMaximized={false}
            />
          )}
        />
        {isMaximizedMode && maximizedCardIndex !== null && (
          <ObservationCard
            observation={observations[maximizedCardIndex]}
            predictionOverride={predictionOverrides[observations[maximizedCardIndex].location]}
            onPredictionOverride={onPredictionOverride}
            onPhotoClick={setMaximizedCardIndex}
            observationIndex={maximizedCardIndex}
            isMaximized
          />
        )}
      </div>
    </div>
  );
}
