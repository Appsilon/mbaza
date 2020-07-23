import { LOCATION_CHANGE } from 'connected-react-router';
import { createMiddleware, EventsMap } from 'redux-beacon';
import { trackPageView } from '@redux-beacon/google-analytics';
import OfflineWeb from '@redux-beacon/offline-web';
import logger from '@redux-beacon/logger';
import Analytics from 'electron-ga';

const eventsMap: EventsMap = {
  [LOCATION_CHANGE]: trackPageView(action => ({
    page: action.payload.location.pathname
  }))
};

// Meaningless for us, but required by Google Analytics Measurement Protocol:
// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dh
const HOST = 'electron';

const analytics = new Analytics('UA-167871460-1');
function analyticsTarget(events) {
  events.forEach(event => {
    if (event.hitType === 'pageview') {
      // TODO: Also send `event.timeSaved` if present (happens when events are
      // retrieved from offline storage).
      analytics.send('pageview', { dh: HOST, dp: event.page });
    } else {
      // TODO: Globally disable `no-console` warnings in eslint (this warning
      // probably makes no sense for us) and remove one-line disablers:
      // https://eslint.org/docs/rules/no-console#when-not-to-use-it
      // eslint-disable-next-line no-console
      console.warn(`Unexpected event.hitType: ${event.hitType}`);
    }
  });
}

const offlineStorage = OfflineWeb(
  // TODO: Understand why using `navigator.online` seems to work. The docs
  // of `offline-web` state, that the connectivity flag should be stored
  // in app state (e.g. `state.isConnected`):
  // https://github.com/rangle/redux-beacon/blob/cad24678a7be400cb0ba2f5e6d57f47945965f50/docs/extensions/offline-web.md
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state: { isConnected: boolean }) => navigator.onLine
);

const gaMiddleware = createMiddleware(eventsMap, analyticsTarget, {
  logger,
  offlineStorage
});
export default gaMiddleware;
