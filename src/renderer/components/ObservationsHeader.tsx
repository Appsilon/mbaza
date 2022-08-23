import { Button } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { taxonOptions } from '../constants/taxons';
import CreatableSelect from './CreatableSelect';
import styles from './ObservationsHeader.module.scss';

const cx = classNames.bind(styles);

type ObservationsHeaderProps = {
  observations: Observation[];
  isCardMaximized: boolean;
  selectedCardsTotal: number;
  onBackButtonClick: () => void;
  onPredictionsOverride: (override: CreatableOption | null) => void;
};

export default function ObservationsHeader(props: ObservationsHeaderProps) {
  const {
    observations,
    isCardMaximized,
    selectedCardsTotal,
    onBackButtonClick,
    onPredictionsOverride,
  } = props;
  const { t } = useTranslation();
  const [globalOverride, setGlobalOverride] = useState<CreatableOption | null>(null);

  const handleBackButtonClick = () => {
    onBackButtonClick();
    setGlobalOverride(null);
  };

  const handleUpdateButtonClick = () => {
    onPredictionsOverride(globalOverride);
    handleBackButtonClick();
  };

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
    ? t('explore.inspect.selected', { count: selectedCardsTotal })
    : t('explore.inspect.header', { station: observations[0].station });

  return (
    <div className={containerClass}>
      <div className={cx({ side: true, left: true })}>
        <Button
          className={styles.backButton}
          icon={isCardMaximized || !selectedCardsTotal ? 'chevron-left' : 'cross'}
          minimal
          alignText="left"
          onClick={handleBackButtonClick}
          text={backButtonText}
        />
      </div>
      <h4 className={styles.heading}>{headingText}</h4>
      <div className={cx({ side: true, right: true })}>
        {selectedCardsTotal ? (
          <>
            <CreatableSelect
              value={globalOverride}
              options={taxonOptions}
              onChange={setGlobalOverride}
              isDisabled={!selectedCardsTotal}
              isClearable={!!globalOverride}
              menuShouldScrollIntoView={false}
              menuPlacement="auto"
            />
            <Button
              className={styles.updateButton}
              intent="primary"
              disabled={!globalOverride}
              onClick={handleUpdateButtonClick}
              text="Update Selected"
            />
          </>
        ) : (
          <p className={styles.counter}>
            {t('explore.inspect.observations', { count: observations.length })}
          </p>
        )}
      </div>
    </div>
  );
}