import { useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import ObservationCard from './ObservationCard';
import ObservationsHeader from './ObservationsHeader';
import MaximizedObservationCard from './MaximizedObservationCard';
import { predictionOverrideWrapper } from './observationsComponents';
import styles from './ObservationsInspector.module.scss';

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionsOverride: PredictionsOverrideHandler;
};

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const { observations, onClose, predictionOverrides, onPredictionsOverride } = props;
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
              predictionOverride={predictionOverrides[observations[index].location]}
              onPredictionOverride={onPredictionsOverride}
              onPhotoClick={handlePhotoClick}
              lastObservationIndex={observations.length - 1}
              onCardSelect={handleSelectedCards}
              predictionOverrideWrapper={() =>
                predictionOverrideWrapper(
                  observations[index],
                  predictionOverrides,
                  onPredictionOverride
                )
              }
              observationIndex={index}
            />
          )}
        />
        {maximizedCard !== null && (
          <MaximizedObservationCard
            observation={observations[maximizedCard]}
            predictionOverride={predictionOverrides[observations[maximizedCard].location]}
            onPredictionOverride={onPredictionsOverride}
            onPhotoClick={handlePhotoClick}
            lastObservationIndex={observations.length - 1}
            onCardSelect={handleSelectedCards}
            observationIndex={maximizedCard}
            predictionOverrideWrapper={() =>
              predictionOverrideWrapper(
                observations[index],
                predictionOverrides,
                onPredictionOverride
              )
            }
          />
        )}
      </div>
    </div>
  );
}
