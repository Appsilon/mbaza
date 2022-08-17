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

  const backButtonText = isSelectionMode
    ? null
    : t(isCardMaximized ? 'explore.backToObservations' : 'explore.backToMap');

  return (
    <div className={styles.container}>
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
  );
}
