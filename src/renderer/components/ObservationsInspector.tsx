import { useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import MaximizedObservationCard from './MaximizedObservationCard';
import ObservationCard from './ObservationCard';
import ObservationsHeader from './ObservationsHeader';
import { predictionOverrideWrapper } from './observationsHelpers';
import styles from './ObservationsInspector.module.scss';

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionOverride } = props;
  const [maximizedCard, setMaximizedCard] = useState<number | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const isSelectionMode = selectedCards.length > 0;
  const lastObservationIndex = observations.length - 1;

  const handlePreviousObservationClick = (currentIndex: number) => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : lastObservationIndex;
    setMaximizedCard(newIndex);
  };
  const handleNextObservationClick = (currentIndex: number) => {
    const newIndex = currentIndex < lastObservationIndex ? currentIndex + 1 : 0;
    setMaximizedCard(newIndex);
  };
  const handleSelectedCards = (cardIndex: number, cardSelected: boolean) => {
    if (cardSelected) {
      setSelectedCards([...selectedCards, cardIndex]);
    } else {
      setSelectedCards(selectedCards.filter((c) => c !== cardIndex));
    }
  };
  const handlePhotoClick = (cardIndex: number | null, cardSelected: boolean) => {
    if (isSelectionMode && cardIndex !== null) {
      handleSelectedCards(cardIndex, cardSelected);
    } else {
      setMaximizedCard(cardIndex);
    }
  };
  const handleBackButtonClick = () => {
    if (maximizedCard !== null) {
      setMaximizedCard(null);
    } else if (isSelectionMode) {
      setSelectedCards([]);
    } else {
      onClose();
    }
  };

  const handleGlobalOverride = (override: CreatableOption | null) => {
    const locations = observations
      .filter((_observation, index) => selectedCards.includes(index))
      .map((observation) => observation.location);
    onPredictionsOverride(locations, override);
  };

  return (
    <div className={styles.box}>
      <ObservationsHeader
        observations={observations}
        isCardMaximized={maximizedCard !== null}
        selectedCardsTotal={selectedCards.length}
        onBackButtonClick={handleBackButtonClick}
        onPredictionsOverride={handleGlobalOverride}
      />
      <div className={styles.boxBody}>
        <VirtuosoGrid
          totalCount={observations.length}
          listClassName={styles.list}
          itemContent={(index) => (
            <ObservationCard
              observation={observations[index]}
              observationIndex={index}
              isSelected={selectedCards.findIndex((card) => card === index) >= 0}
              onPhotoClick={setMaximizedCard}
              onCardSelect={handleSelectedCards}
              predictionOverrideWrapper={() =>
                predictionOverrideWrapper(
                  observations[index],
                  predictionOverrides,
                  onPredictionsOverride
                )
              }
            />
          )}
        />
        {maximizedCard !== null && (
          <MaximizedObservationCard
            observation={observations[maximizedCard]}
            observationIndex={maximizedCard}
            onPhotoClick={setMaximizedCard}
            onPrevious={handlePreviousObservationClick}
            onNext={handleNextObservationClick}
            predictionOverrideWrapper={() =>
              predictionOverrideWrapper(
                observations[maximizedCard],
                predictionOverrides,
                onPredictionsOverride
              )
            }
          />
        )}
      </div>
    </div>
  );
}
