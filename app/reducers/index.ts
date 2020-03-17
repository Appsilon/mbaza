import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import counter from './counter';
import logMessage from './logMessage';
import classify from './classify';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter,
    logMessage,
    classify
  });
}
