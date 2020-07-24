import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import logMessage from './logMessage';
import classify from './classify';
import online from './online';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    online,
    logMessage,
    classify
  });
}
