import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const orderByName = (a, b) => {
  const nameA = a.label.toUpperCase();
  const nameB = b.label.toUpperCase();

  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
};

export default function ExplorerFilter(props: Props) {
  const { t } = useTranslation();
  const { data, onChange } = props;

  const getUniqueSet = attribute => {
    return Array.from(new Set(data.observations.map(x => x[attribute]))).map(
      item => {
        return { value: item, label: item.replace(/_/g, ' ') };
      }
    );
  };

  const animals = getUniqueSet('pred_1').sort(orderByName);
  const cameras = getUniqueSet('camera').sort(
    (a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)
  );
  const stations = getUniqueSet('station').sort(orderByName);
  const checks = getUniqueSet('check').sort(
    (a, b) => parseInt(b.value, 10) - parseInt(a.value, 10)
  );

  const setAnimals = options => {
    let result = [];
    if (Array.isArray(options)) result = options;
    onChange({ activeAnimals: result });
  };
  const setStations = options => {
    let result = [];
    if (Array.isArray(options)) result = options;
    onChange({ activeStations: result });
  };
  const setCameras = options => {
    let result = [];
    if (Array.isArray(options)) result = options;
    onChange({ activeCameras: result });
  };
  const setChecks = options => {
    let result = [];
    if (Array.isArray(options)) result = options;
    onChange({ activeChecks: result });
  };

  return (
    <div
      className="filter-wrapper"
      style={{
        width: '100%',
        paddingBottom: '10px',
        display: 'inline-flex'
      }}
    >
      <div style={{ width: '50%', paddingRight: '5px' }}>
        <h4 style={{ marginBottom: '5px' }}>{t('By animal')}</h4>
        <Select
          onChange={setAnimals}
          closeMenuOnSelect={false}
          options={animals}
          isMulti
        />
      </div>
      <div style={{ width: '50%', padding: '0 5px' }}>
        <h4 style={{ marginBottom: '5px' }}>{t('By station')}</h4>
        <Select
          onChange={setStations}
          closeMenuOnSelect={false}
          options={stations}
          isMulti
        />
      </div>
      <div style={{ width: '50%', padding: '0 5px' }}>
        <h4 style={{ marginBottom: '5px' }}>{t('By camera')}</h4>
        <Select
          onChange={setCameras}
          closeMenuOnSelect={false}
          options={cameras}
          isMulti
        />
      </div>
      <div style={{ width: '50%', paddingLeft: '5px' }}>
        <h4 style={{ marginBottom: '5px' }}>{t('By check')}</h4>
        <Select
          onChange={setChecks}
          closeMenuOnSelect={false}
          options={checks}
          isMulti
        />
      </div>
    </div>
  );
}
