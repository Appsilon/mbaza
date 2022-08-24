import { formatAnimalClassName } from '../constants/animalsClasses';

export const getTopPrediction = (observation) => {
  return {
    value: observation.pred_1,
    label: formatAnimalClassName(observation.pred_1),
  };
};

export const getPredictions = (observation) => {
  return [
    [formatAnimalClassName(observation.pred_1), observation.score_1],
    [formatAnimalClassName(observation.pred_2), observation.score_2],
    [formatAnimalClassName(observation.pred_3), observation.score_3],
  ];
};
