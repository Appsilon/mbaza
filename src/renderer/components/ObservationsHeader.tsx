import { Button } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { taxonOptions } from '../constants/taxons';

import styles from './ObservationsHeader.module.scss';

const cx = classNames.bind(styles);

type ObservationsHeaderProps = {
  observations: Observation[];
  isCardMaximized: boolean;
  selectedCardsTotal: number;
  onBackButtonClick: () => void;
  onPredictionChange: (override: string) => void;
};

export default function ObservationsHeader(props: ObservationsHeaderProps) {
  const {
    observations,
    isCardMaximized,
    selectedCardsTotal,
    onBackButtonClick,
    onPredictionChange,
  } = props;
  const { t } = useTranslation();
  const [globalOverride, setGlobalOverride] = useState<string | null>(null);

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
      <div className={styles.side}>
        <Button
          className={styles.backButton}
          icon={isCardMaximized || !selectedCardsTotal ? 'chevron-left' : 'cross'}
          minimal
          alignText="left"
          onClick={onBackButtonClick}
          text={backButtonText}
        />
      </div>
      <h4 className={styles.heading}>{headingText}</h4>
      <div className={styles.side}>
        {selectedCardsTotal ? (
          <>
            <CreatableSelect
              value={globalOverride}
              options={taxonOptions}
              onChange={setGlobalOverride}
              // isDisabled={isSelected}
              // isClearable={predictionOverride !== undefined}
              // menuShouldScrollIntoView={false}
              // className={styles.predictionOverride}
              // menuPlacement="auto"
            />
            <Button
              minimal
              alignText="left"
              onClick={() => onPredictionChange(globalOverride)}
              text="Override"
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
