import { formatAnimalClassName } from '../constants/animalsClasses';

export const getTopPrediction = (observation: Observation): CreatableOption => {
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
