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
    common_name: name
  };
}

function applyPredictionOverrides(
  observations: Observation[],
  predictionOverrides: Record<string, CreatableOption>
) {
  return observations.map(row => {
    const override = predictionOverrides[row.location];
    if (override) {
      // The __isNew__ name is due to CreatableSelect from react-select.
      // eslint-disable-next-line no-underscore-dangle
      const taxon = override.__isNew__ ? emptyTaxon(override.value) : taxonMap[override.value];
      return {
        ...row,
        ...taxon,
        identified_by: 'user',
        uncertainty: 1
      };
    }
    return row;
  });
}

function observationsToCsv(observations: Observation[]) {
  const header = Object.keys(observations[0]).join(',');
  const rows = observations.map(row => Object.values(row).join(','));
  return `${[header, ...rows].join('\n')}\n`;
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
