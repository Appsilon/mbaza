import { NumberRange, RangeSlider } from '@blueprintjs/core';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';

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
    <div style={{ padding: '0 15px', width: '100%' }}>
      <h4 style={{ marginBottom: '5px' }}>{t('explore.certaintyRange')}</h4>
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
