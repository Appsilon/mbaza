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
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  const handleSelectedCards = (cardIndex: number, cardSelected: boolean) => {
    if (cardSelected) {
      setSelectedCards([...selectedCards, cardIndex]);
    } else {
      setSelectedCards(selectedCards.filter((c) => c !== cardIndex));
    }
  };

  const handlePhotoClick = (cardIndex: number | null) => {
    if (selectedCards.length === 0) setMaximizedCard(cardIndex);
  };

  const handleCardClick = (cardIndex: number, isSelected) => {
    console.log('isSelected', isSelected);
    if (selectedCards.length > 0) handleSelectedCards(cardIndex, isSelected);
  };

  const backButtonText = t(
    maximizedCard !== null ? 'explore.backToObservations' : 'explore.backToMap'
  );
  const onBackButtonClick = () => (maximizedCard !== null ? setMaximizedCard(null) : onClose());

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
          itemContent={(index) => (
            <ObservationCard
              observation={observations[index]}
              predictionOverride={predictionOverrides[observations[index].location]}
              onPredictionOverride={onPredictionOverride}
              onPhotoClick={handlePhotoClick}
              onCardClick={handleCardClick}
              onCardSelect={handleSelectedCards}
              observationIndex={index}
              isMaximized={false}
            />
          )}
        />
        {maximizedCard !== null && (
          <ObservationCard
            observation={observations[maximizedCard]}
            predictionOverride={predictionOverrides[observations[maximizedCard].location]}
            onPredictionOverride={onPredictionOverride}
            onPhotoClick={setMaximizedCard}
            onCardClick={handleCardClick}
            onCardSelect={handleSelectedCards}
            observationIndex={maximizedCard}
            isMaximized
          />
        )}
      </div>
    </div>
  );
}
