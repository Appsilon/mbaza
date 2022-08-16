import { csvFormat } from 'd3-dsv';
import format from 'date-fns/format';
import { writeFile } from 'fs';

import { taxonMap } from '../constants/taxons';

function emptyTaxon(name: string) {
  return {
    wi_taxon_id: '',
    class: '',
    order: '',
    family: '',
    genus: '',
    species: '',
    common_name: name,
  };
}

function applyPredictionOverrides(
  observations: Observation[],
  predictionOverrides: Record<string, CreatableOption>
) {
  return observations.map((row) => {
    const override = predictionOverrides[row.location];
    if (override) {
      // The __isNew__ name is due to CreatableSelect from react-select.
      // eslint-disable-next-line no-underscore-dangle
      const taxon = override.__isNew__ ? emptyTaxon(override.value) : taxonMap[override.value];
      return {
        ...row,
        ...taxon,
        identified_by: 'user',
        uncertainty: 1,
        label: override.value,
      };
    }
    return row;
  });
}

function observationsToCsv(observations: Observation[]): string {
  return csvFormat(
    observations.map((o) => ({
      ...o,
      timestamp: o.timestamp === undefined ? '' : format(o.timestamp, 'yyyy-MM-dd HH:mm:ss'),
    }))
  );
}

export default function writeCorrectedCsv(
  path: string,
  observations: Observation[],
  predictionOverrides: Record<string, CreatableOption>
) {
  const corrected = applyPredictionOverrides(observations, predictionOverrides);
  const csv = observationsToCsv(corrected);
  writeFile(path, csv, () => {});
}
