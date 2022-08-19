import { Button } from '@blueprintjs/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VirtuosoGrid } from 'react-virtuoso';

import ObservationCard from './ObservationCard';
import styles from './ObservationsInspector.module.scss';

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionOverride: PredictionOverrideHandler;
};

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionOverride } = props;
  const { t } = useTranslation();
  const [maximizedCard, setMaximizedCard] = useState<number | null>(null);
  const [prevCardIndex, setPrevCardIndex] = useState<number | null>(null);
  const [isSliding, setSliding] = useState<boolean>(false);
  const backButtonText = t(
    maximizedCard !== null ? 'explore.backToObservations' : 'explore.backToMap'
  );
  const onBackButtonClick = () => (maximizedCard !== null ? setMaximizedCard(null) : onClose());
  const maximizedObservationsIndexes = [maximizedCard, prevCardIndex].flatMap((f) => f || []);

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
          {t('explore.inspect.observations', {
            count: observations.length,
            current: maximizedCard !== null ? `${maximizedCard + 1} / ` : '',
          })}
        </p>
      </div>
      <div className={styles.boxBody}>
        <VirtuosoGrid
          totalCount={observations.length}
          listClassName={styles.list}
          itemContent={(index) => (
            <ObservationCard
              observation={observations[index]}
              predictionOverride={predictionOverrides[observations[index].location]}
              onPredictionOverride={onPredictionOverride}
              onPhotoClick={setMaximizedCard}
              onSlideInit={setPrevCardIndex}
              onSlideStart={setSliding}
              lastObservationIndex={observations.length - 1}
              observationIndex={index}
              isMaximized={false}
              prevCardIndex={prevCardIndex}
              isSliding={isSliding}
            />
          )}
        />
        {maximizedCard !== null &&
          maximizedObservationsIndexes.map((index) => (
            <ObservationCard
              observation={observations[index]}
              predictionOverride={predictionOverrides[observations[index].location]}
              onPredictionOverride={onPredictionOverride}
              onPhotoClick={setMaximizedCard}
              onSlideInit={setPrevCardIndex}
              onSlideStart={setSliding}
              lastObservationIndex={observations.length - 1}
              observationIndex={index}
              isMaximized
              prevCardIndex={prevCardIndex}
              isSliding={isSliding}
            />
          ))}
      </div>
    </div>
  );
}
