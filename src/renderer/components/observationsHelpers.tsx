import classNames from 'classnames/bind';
import path from 'path';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';

import { formatAnimalClassName } from '../constants/animalsClasses';
import { taxonOptions } from '../constants/taxons';
import styles from './observationsHelpers.module.scss';

const cx = classNames.bind(styles);

const getTopPrediction = (observation: Observation): CreatableOption => {
  return {
    value: observation.pred_1,
    label: formatAnimalClassName(observation.pred_1),
  };
};

export const getPredictions = (observation: Observation): Predictions => {
  return [
    [formatAnimalClassName(observation.pred_1), observation.score_1],
    [formatAnimalClassName(observation.pred_2), observation.score_2],
    [formatAnimalClassName(observation.pred_3), observation.score_3],
  ];
};

export function PredictionsTable({ predictions, maximized }: PredictionsTable) {
  const { t } = useTranslation();
  const className = cx('predictionsTable', { maximized });
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

function PhotoDetail({ label, value }: PhotoDetail) {
  const { t } = useTranslation();
  return (
    <p className={styles.photoDetail}>
      <span className={styles.label}>{`${t(`explore.inspect.${label}`)}: `}</span>
      <span>{value}</span>
    </p>
  );
}

export function PhotoDetails({ observation, maximized }: PhotoDetails) {
  const { date, camera, location } = observation;
  const className = cx('photoDetails', { maximized });
  return (
    <div className={className}>
      <PhotoDetail label="date" value={date} />
      <PhotoDetail label="camera" value={camera} />
      <PhotoDetail label="file" value={path.basename(location)} />
    </div>
  );
}

export function predictionOverrideWrapper(
  observation: Observation,
  predictionOverrides: PredictionOverridesMap,
  onPredictionOverride: PredictionsOverrideHandler,
  isSelected?: boolean
) {
  const predictionOverrideValue = predictionOverrides[observation.location];
  const topPrediction = getTopPrediction(observation);
  const handlePredictionOverride = (newPrediction: CreatableOption | null) => {
    if (newPrediction === null || newPrediction.value !== topPrediction.value) {
      onPredictionOverride([observation.location], newPrediction);
    }
  };
  return (
    <CreatableSelect
      value={predictionOverrideValue || topPrediction}
      onChange={handlePredictionOverride}
      options={taxonOptions}
      isDisabled={isSelected}
      isClearable={predictionOverrideValue !== undefined}
      menuShouldScrollIntoView={false}
      menuPlacement="auto"
      className={styles.predictionOverride}
    />
  );
}
