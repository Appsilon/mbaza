import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Select from 'react-select';

export default function ExplorerFilter(props: Props) {
  const { t } = useTranslation();
  const { data, onChange } = props;

  const filterState = {
    activeAnimals: []
  };

  const animals = Array.from(new Set(data.observations.map(x => x.pred_1))).map(
    item => {
      return { value: item, label: item.replace(/_/g, ' ') };
    }
  );

  const setAnimals = options => {
    filterState.activeAnimals = options;
    onChange(filterState);
  };

  return (
    <div
      className="filter-wrapper"
      style={{
        height: '100px',
        paddingBottom: '20px',
        display: 'inline-flex'
      }}
    >
      <div style={{ width: '100%' }}>
        <h3>{t('By animal')}</h3>
        <Select
          onChange={setAnimals}
          closeMenuOnSelect={false}
          options={animals}
          isMulti
        />
      </div>
    </div>
  );
}
