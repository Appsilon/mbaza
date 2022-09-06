import { useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import classNames from 'classnames/bind';
import MaximizedObservationCard from './MaximizedObservationCard';
import ObservationCard from './ObservationCard';
import ObservationsHeader from './ObservationsHeader';
import { OverrideWidget } from './observationsHelpers';
import styles from './ObservationsInspector.module.scss';

export default function ObservationsInspector(props: ObservationsInspectorProps) {
  const cx = classNames.bind(styles);
  const { observations, onClose, predictionOverrides, onPredictionsOverride, photosPath } = props;
  const [maximizedCard, setMaximizedCard] = useState<number | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [cardsTotalInRow, setCardsTotalInRow] = useState<number>(3);
  const [cardsLayoutPopoverOpen, setCardsLayoutPopoverOpen] = useState<boolean>(false);
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
    setCardsLayoutPopoverOpen(false);
  };

  const handlePhotoClick = (cardIndex: number | null, cardSelected: boolean) => {
    if (isSelectionMode && cardIndex !== null) {
      handleSelectedCards(cardIndex, cardSelected);
    } else {
      setMaximizedCard(cardIndex);
    }
    setCardsLayoutPopoverOpen(false);
  };

  const handleBackButtonClick = () => {
    if (maximizedCard !== null) {
      setMaximizedCard(null);
    } else if (isSelectionMode) {
      setSelectedCards([]);
    } else {
      onClose();
    }
    setCardsLayoutPopoverOpen(false);
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
        maximizedCardIndex={maximizedCard}
        selectedCardsTotal={selectedCards.length}
        cardsTotalInRow={cardsTotalInRow}
        isCardsLayoutPopover={cardsLayoutPopoverOpen}
        onBackButtonClick={handleBackButtonClick}
        onPredictionsOverride={handleGlobalOverride}
        onCardsSizeChange={setCardsTotalInRow}
        showCardsLayoutPopover={setCardsLayoutPopoverOpen}
      />
      <div className={styles.boxBody}>
        <VirtuosoGrid
          totalCount={observations.length}
          listClassName={cx('list', `list--${cardsTotalInRow}`)}
          itemContent={(index) => {
            const isSelected = selectedCards.findIndex((card) => card === index) >= 0;
            return (
              <ObservationCard
                observation={observations[index]}
                observationIndex={index}
                isSelected={isSelected}
                isSelectionMode={isSelectionMode}
                photosPath={photosPath}
                onPhotoClick={handlePhotoClick}
                onCardSelect={handleSelectedCards}
                overrideWidget={
                  <OverrideWidget
                    observation={observations[index]}
                    predictionOverrides={predictionOverrides}
                    onPredictionOverride={onPredictionsOverride}
                    isDisabled={isSelected}
                  />
                }
              />
            );
          }}
        />
        {maximizedCard !== null && (
          <MaximizedObservationCard
            observation={observations[maximizedCard]}
            observationIndex={maximizedCard}
            photosPath={photosPath}
            onPhotoClick={handlePhotoClick}
            onPrevious={handlePreviousObservationClick}
            onNext={handleNextObservationClick}
            overrideWidget={
              <OverrideWidget
                observation={observations[maximizedCard]}
                predictionOverrides={predictionOverrides}
                onPredictionOverride={onPredictionsOverride}
              />
            }
          />
        )}
      </div>
    </div>
  );
}
