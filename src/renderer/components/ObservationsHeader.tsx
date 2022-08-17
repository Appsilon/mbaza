import { Button } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import styles from './ObservationsHeader.module.scss';

const cx = classNames.bind(styles);

type ObservationsHeaderProps = {
  observations: Observation[];
  isCardMaximized: boolean;
  selectedCardsTotal: number;
  onBackButtonClick: () => void;
};

export default function ObservationsHeader(props: ObservationsHeaderProps) {
  const { observations, isCardMaximized, selectedCardsTotal, onBackButtonClick } = props;
  const { t } = useTranslation();
  const containerClass = cx({
    container: true,
    selectionMode: selectedCardsTotal,
  });
  let backButtonText = '';

  if (isCardMaximized) {
    backButtonText = t('explore.backToObservations');
  } else if (!selectedCardsTotal) {
    backButtonText = t('explore.backToMap');
  }

  const headingText = selectedCardsTotal
    ? t('explore.inspect.selected', {
        count: selectedCardsTotal,
        suffix: selectedCardsTotal === 1 ? '' : 's',
      })
    : t('explore.inspect.header', { station: observations[0].station });

  return (
    <div className={containerClass}>
      <Button
        className={styles.backButton}
        icon={isCardMaximized || !selectedCardsTotal ? 'chevron-left' : 'cross'}
        minimal
        alignText="left"
        onClick={onBackButtonClick}
        text={backButtonText}
      />
      <h4 className={styles.heading}>{headingText}</h4>
      {selectedCardsTotal ? (
        <>
          <div>placeholder</div>
        </>
      ) : (
        <p className={styles.counter}>
          {t('explore.inspect.observations', { count: observations.length })}
        </p>
      )}
    </div>
  );
}
