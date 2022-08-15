import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import CertaintyFilter from './CertaintyFilter';
import styles from './ExplorerFilters.module.scss';

type Props = {
  observations: Observation[];
  updateFilters: Function; // eslint-disable-line @typescript-eslint/ban-types
};

type Entry = {
  label: string;
  value: string;
};

const orderByName = (a: Entry, b: Entry) => {
  const nameA = a.label.toUpperCase();
  const nameB = b.label.toUpperCase();

  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
};

function formatLabel(label: string): string {
  if (label) return label.replace(/_/g, ' ');
  return '<?>';
}

export default function ExplorerFilter(props: Props) {
  const { t } = useTranslation();
  const { observations, updateFilters } = props;

  const getUniqueSet = (dataset: string[]) => {
    return Array.from(new Set(dataset)).map((entry: string) => {
      return { value: entry, label: formatLabel(entry) };
    });
  };

  const animals = getUniqueSet(observations.map((entry) => entry.label)).sort(orderByName);
  const cameras = getUniqueSet(observations.map((entry) => entry.camera)).sort(
    (a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)
  );
  const stations = getUniqueSet(observations.map((entry) => entry.station)).sort(orderByName);

  const setAnimals = (options: Entry[]) => {
    let result: Entry[] = [];
    if (Array.isArray(options)) result = options;
    updateFilters({ activeAnimals: result });
  };
  const setStations = (options: Entry[]) => {
    let result: Entry[] = [];
    if (Array.isArray(options)) result = options;
    updateFilters({ activeStations: result });
  };
  const setCameras = (options: Entry[]) => {
    let result: Entry[] = [];
    if (Array.isArray(options)) result = options;
    updateFilters({ activeCameras: result });
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <h4 className={styles.label}>{t('explore.byAnimal')}</h4>
        <Select onChange={setAnimals} closeMenuOnSelect={false} options={animals} isMulti />
      </div>
      <div className={styles.inputGroup}>
        <h4 className={styles.label}>{t('explore.byStation')}</h4>
        <Select onChange={setStations} closeMenuOnSelect={false} options={stations} isMulti />
      </div>
      <div className={styles.inputGroup}>
        <h4 className={styles.label}>{t('explore.byCamera')}</h4>
        <Select onChange={setCameras} closeMenuOnSelect={false} options={cameras} isMulti />
      </div>
      <CertaintyFilter updateFilters={updateFilters} />
    </div>
  );
}
