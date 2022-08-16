import { NumberRange, RangeSlider } from '@blueprintjs/core';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './CertaintyFilter.module.scss';

type CertaintyFilterProps = {
  updateFilters: Function; // eslint-disable-line @typescript-eslint/ban-types
};

export default function CertaintyFilter({ updateFilters }: CertaintyFilterProps) {
  const { t } = useTranslation();
  const [range, setRange] = useState<NumberRange>([0, 100]);

  const updateFilter = (newRange: NumberRange) => {
    const [low, high] = newRange;
    updateFilters({ certaintyRange: [low / 100, high / 100] });
  };
  // TODO: Don't rely on `useCallback` as a semantic guarantee:
  // https://reactjs.org/docs/hooks-reference.html#usecallback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateFilter = useCallback(debounce(updateFilter, 400), []);

  return (
    <div className={styles.container}>
      <h4 className={styles.label}>{t('explore.certaintyRange')}</h4>
      <RangeSlider
        min={0}
        max={100}
        labelStepSize={20}
        labelRenderer={(value) => `${value}%`}
        value={range}
        onChange={(newRange: NumberRange) => {
          setRange(newRange);
          debouncedUpdateFilter(newRange);
        }}
      />
    </div>
  );
}
