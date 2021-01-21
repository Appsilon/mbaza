import { writeFile } from "fs";

function applyPredictionOverrides(
  observations: Observation[],
  predictionOverrides: Record<string, string>
) {
  return observations.map((row) => {
    if (row.location in predictionOverrides) {
      return {
        ...row,
        identified_by: 'user',
        wi_taxon_id: '',
        class: '',
        order: '',
        family: '',
        genus: '',
        species: '',
        common_name: predictionOverrides[row.location],
        uncertainty: 1,
      }
    }
    return row;
  });
}

function observationsToCsv(observations: Observation[]) {
  const header = Object.keys(observations[0]).join(',');
  const rows = observations.map((row) => Object.values(row).join(','));
  return [header, ...rows].join('\n') + '\n';
}

export default function writeCorrectedCsv(
  path: string,
  observations: Observation[],
  predictionOverrides: Record<string, string>
) {
  const corrected = applyPredictionOverrides(observations, predictionOverrides)
  const csv = observationsToCsv(corrected);
  writeFile(path, csv, () => {});
}
