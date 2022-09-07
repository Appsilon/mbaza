import _ from 'lodash';

export type InferenceResult = Record<string, number>;

function f(result: InferenceResult) {
  const top = _.sortBy(_.toPairs(result), 1).reverse();
  return {
    pred_1: top[0][0],
    pred_2: top[1][0],
    pred_3: top[2][0],
    score_1: top[0][1],
    score_2: top[1][1],
    score_3: top[2][1],
  };
}

export default function getTopPredictions(results: InferenceResult[]) {
  return results.map(f);
}
