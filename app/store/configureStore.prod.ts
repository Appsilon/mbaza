import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import { Store, classifierStateType } from '../reducers/types';
import gaMiddleware from './analyticsMiddleware';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router, gaMiddleware);

function configureStore(initialState?: classifierStateType): Store {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
