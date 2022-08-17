import { Button } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

import styles from './ObservationsHeader.module.scss';

type ObservationsHeaderProps = {
  observations: Observation[];
  isCardMaximized: boolean;
  isSelectionMode: boolean;
  onBackButtonClick: () => void;
};

export default function ObservationsHeader(props: ObservationsHeaderProps) {
  const { observations, isCardMaximized, isSelectionMode, onBackButtonClick } = props;
  const { t } = useTranslation();
  let backButtonText = '';

  if (isCardMaximized) {
    backButtonText = t('explore.backToObservations');
  } else if (!isSelectionMode) {
    backButtonText = t('explore.backToMap');
  }

  return (
    <div className={styles.container}>
      <Button
        className={styles.backButton}
        icon={isCardMaximized || !isSelectionMode ? 'chevron-left' : 'cross'}
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
  );
}
