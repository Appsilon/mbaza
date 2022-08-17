import { Button } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VirtuosoGrid } from 'react-virtuoso';

import ObservationCard from './ObservationCard';
import styles from './ObservationsInspector.module.scss';

const cx = classNames.bind(styles);

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
  const handlePhotoClick = (cardIndex: number | null, cardSelected: boolean) => {
    if (selectedCards.length > 0 && cardIndex !== null) {
      handleSelectedCards(cardIndex, cardSelected);
    } else {
      setMaximizedCard(cardIndex);
    }
  };
  const onBackButtonClick = () => (maximizedCard !== null ? setMaximizedCard(null) : onClose());

  const backButtonText = t(
    maximizedCard !== null ? 'explore.backToObservations' : 'explore.backToMap'
  );
  const boxClass = cx({
    box: true,
    selectionMode: selectedCards.length > 0,
  });

  return (
    <div className={boxClass}>
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
              onCardSelect={handleSelectedCards}
              observationIndex={index}
              isMaximized={false}
              isSelected={selectedCards.findIndex((card) => card === index) >= 0}
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
          />
        )}
      </div>
    </div>
  );
}
