import { LOCATION_CHANGE } from 'connected-react-router';
import { createMiddleware, EventsMap, EventsMapper } from 'redux-beacon';
import { trackPageView } from '@redux-beacon/google-analytics';
import OfflineWeb from '@redux-beacon/offline-web';
import logger from '@redux-beacon/logger';

import {
  createElectronGoogleAnalyticsTarget,
  actionMetaEventMapper
} from 'redux-beacon-electron';

interface FSA {
  type: string;
  payload: any;
  meta?: any;
}

const eventsMap: EventsMap = {
  [LOCATION_CHANGE]: trackPageView(action => ({
    page: action.payload.location.pathname
  }))
};

const eventsMapper = (action: FSA) => {
  if (action.type in eventsMap) {
    return eventsMap[action.type];
  }
  return actionMetaEventMapper(action as FSA);
};

const isConnected = (state: { isConnected: boolean }) => navigator.onLine; //state.isConnected;
// Pass the connectivity selector
const offlineStorage = OfflineWeb(isConnected);

const electronTarget = createElectronGoogleAnalyticsTarget({
  ua: 'UA-167871460-1'
});
const gaMiddleware = createMiddleware(
  eventsMapper as EventsMapper,
  electronTarget,
  {
    logger,
    offlineStorage
  }
);

export default gaMiddleware;
