import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import logMessage from './logMessage';
import classify from './classify';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    logMessage,
    classify
  });
}
