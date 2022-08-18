import { useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import ObservationCard from './ObservationCard';
import ObservationsHeader from './ObservationsHeader';
import styles from './ObservationsInspector.module.scss';

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionOverride: PredictionOverrideHandler;
};

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionOverride } = props;
  const [maximizedCard, setMaximizedCard] = useState<number | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const isSelectionMode = selectedCards.length > 0;

  const handleSelectedCards = (cardIndex: number, cardSelected: boolean) => {
    if (cardSelected) {
      setSelectedCards([...selectedCards, cardIndex]);
    } else {
      setSelectedCards(selectedCards.filter((c) => c !== cardIndex));
    }
  };
  const handlePhotoClick = (cardIndex: number | null, cardSelected: boolean) => {
    if (selectedCards.length > 0 && cardIndex !== null) {
      handleSelectedCards(cardIndex, cardSelected);
    } else {
      setMaximizedCard(cardIndex);
    }
  };
  const handleBackButtonClick = () => {
    if (maximizedCard !== null) {
      setMaximizedCard(null);
    } else if (selectedCards.length > 0) {
      setSelectedCards([]);
    } else {
      onClose();
    }
  };

  const handleGlobalOverride = (override: CreatableOption | null) => {
    observations
      .filter((obs, index) => selectedCards.includes(index))
      // TODO: update state by dispatching all overrides at once
      .forEach((observation, index) => {
        onPredictionOverride(observation.location, override);
      });
  };

  return (
    <div className={styles.box}>
      <ObservationsHeader
        observations={observations}
        isCardMaximized={maximizedCard !== null}
        selectedCardsTotal={selectedCards.length}
        onBackButtonClick={handleBackButtonClick}
        onPredictionChange={handleGlobalOverride}
      />
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
              onCardSelect={handleSelectedCards}
              observationIndex={index}
              isMaximized={false}
              isSelected={selectedCards.findIndex((card) => card === index) >= 0}
              isSelectionMode={isSelectionMode}
            />
          )}
        />
        {maximizedCard !== null && (
          <ObservationCard
            observation={observations[maximizedCard]}
            predictionOverride={predictionOverrides[observations[maximizedCard].location]}
            onPredictionOverride={onPredictionOverride}
            onPhotoClick={handlePhotoClick}
            onCardSelect={handleSelectedCards}
            observationIndex={maximizedCard}
            isMaximized
            isSelected={false}
            isSelectionMode={false}
          />
        )}
      </div>
    </div>
  );
}
