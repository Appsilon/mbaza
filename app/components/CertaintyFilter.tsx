import { NumberRange, RangeSlider } from '@blueprintjs/core';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import styles from './CertaintyFilter.module.scss';

type CertaintyFilterProps = {
  updateFilters: Function;
};

export default function CertaintyFilter({ updateFilters }: CertaintyFilterProps) {
  const { t } = useTranslation();
  const [range, setRange] = useState<NumberRange>([0, 100]);

  const updateFilter = (newRange: NumberRange) => {
    const [low, high] = newRange;
    updateFilters({ certaintyRange: [low / 100, high / 100] });
  };
  const debouncedUpdateFilter = useCallback(debounce(updateFilter, 400), []);

  return (
    <div className={styles.container}>
      <h4 className={styles.label}>{t('explore.certaintyRange')}</h4>
      <RangeSlider
        min={0}
        max={100}
        labelStepSize={20}
        labelRenderer={value => `${value}%`}
        value={range}
        onChange={(newRange: NumberRange) => {
          setRange(newRange);
          debouncedUpdateFilter(newRange);
        }}
      />
    </div>
  );
}
