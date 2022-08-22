import { Button } from '@blueprintjs/core';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { taxonOptions } from '../constants/taxons';
import styles from './ObservationsHeader.module.scss';
import sassVariables from '../styles/variables.module.scss';

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

  const customStyles: StylesConfig = {
    menu: (base) => ({
      ...base,
      width: 'auto',
    }),
    option: (base, { data, isDisabled, isFocused, isSelected }) => ({
      ...base,
      // eslint-disable-next-line no-nested-ternary
      backgroundColor: isSelected
        ? sassVariables.green80
        : isFocused
        ? sassVariables.green10
        : sassVariables.white,
      borderBottom: `1px solid ${sassVariables.green10}`,
      color: isSelected ? sassVariables.white : sassVariables.green80,
    }),
    control: (base) => ({
      ...base,
      background: sassVariables.green10,
      border: 'none',
      borderRadius: sassVariables.radiusInput,
      boxShadow: 'none',
      cursor: 'pointer',
      display: 'flex',
      fontWeight: 600,
      minHeight: 0,
      padding: '5px',
      width: 200,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 5px 0 0',
    }),
    singleValue: (base) => ({
      ...base,
      color: sassVariables.green80,
    }),
    placeholder: () => ({
      color: sassVariables.green60,
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      padding: 0,
    }),
  };

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
              className={styles.predictionOverride}
              styles={customStyles}
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
