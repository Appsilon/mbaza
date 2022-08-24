import { Button } from '@blueprintjs/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VirtuosoGrid } from 'react-virtuoso';

import MaximizedObservationCard from './MaximizedObservationCard';
import ObservationCard from './ObservationCard';
import { predictionOverrideWrapper } from './observationsComponents';
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
          {t('explore.inspect.observationNumber', {
            currentObservation: maximizedCard !== null ? `${maximizedCard + 1} /` : '',
            count: observations.length,
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
              observationIndex={index}
              predictionOverrideWrapper={() =>
                predictionOverrideWrapper(
                  observations[index],
                  predictionOverrides,
                  onPredictionOverride
                )
              }
            />
          )}
        />
        {maximizedCard !== null && (
          <MaximizedObservationCard
            observation={observations[maximizedCard]}
            predictionOverride={predictionOverrides[observations[maximizedCard].location]}
            onPredictionOverride={onPredictionOverride}
            onPhotoClick={setMaximizedCard}
            lastObservationIndex={observations.length - 1}
            observationIndex={maximizedCard}
            predictionOverrideWrapper={() =>
              predictionOverrideWrapper(
                observations[maximizedCard],
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
