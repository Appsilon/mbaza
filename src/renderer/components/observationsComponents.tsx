import path from 'path';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import { taxonOptions } from '../constants/taxons';
import { getTopPrediction } from '../utils/observationsHelpers';

export function PredictionsTable({ predictions, className }) {
  const { t } = useTranslation();
  return (
    <table className={`${className} bp4-html-table bp4-html-table-condensed`}>
      <thead>
        <tr>
          <th>{t('explore.inspect.prediction')}</th>
          <th>{t('explore.inspect.probability')}</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map((i) => (
          <tr key={i[0]}>
            <td>{i[0]}</td>
            <td>
              {((i[1] as number) * 100).toFixed(2)}
              &nbsp;%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PhotoDetail(label: string, value: string, styles) {
  const { t } = useTranslation();
  return (
    <p className={styles.photoDetail}>
      <span className={styles.label}>{`${t(`explore.inspect.${label}`)}: `}</span>
      <span>{value}</span>
    </p>
  );
}

export function PhotoDetails({ observation, styles }) {
  const { date, camera, location } = observation;
  return (
    <div className={styles.photoDetails}>
      {PhotoDetail('date', date, styles)}
      {PhotoDetail('camera', camera, styles)}
      {PhotoDetail('file', path.basename(location), styles)}
    </div>
  );
}

export function predictionOverrideWrapper(
  observation: Observation,
  predictionOverrides: PredictionOverridesMap,
  onPredictionOverride: PredictionOverrideHandler
) {
  const predictionOverrideValue = predictionOverrides[observation.location];
  const topPrediction = getTopPrediction(observation);
  const handlePredictionOverride = (newPrediction: CreatableOption | null) => {
    if (newPrediction === null || newPrediction.value !== topPrediction.value) {
      onPredictionOverride(observation.location, newPrediction);
    }
  };
  return (
    <CreatableSelect
      value={predictionOverrideValue || topPrediction}
      onChange={handlePredictionOverride}
      options={taxonOptions}
      isClearable={predictionOverrideValue !== undefined}
      menuShouldScrollIntoView={false}
      menuPlacement="auto"
    />
  );
}
