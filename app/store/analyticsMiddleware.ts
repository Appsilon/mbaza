import { createMiddleware } from 'redux-beacon';
import GoogleAnalytics, { trackEvent } from '@redux-beacon/google-analytics';
import OfflineWeb from '@redux-beacon/offline-web';

// Copy & paste the event definition you chose in step 2, then fill it in.
const emitVideoPlayed = trackEvent((action: { type: string }) => ({
  category: 'Videos',
  action: action.type
}));

// Match the event definition to a Redux action:
const eventsMap = {
  PLAY_VIDEO: emitVideoPlayed
};

const isConnected = (state: { isConnected: boolean }) => state.isConnected;

// Pass the connectivity selector from Step 2 as the first parameter
const offlineStorage = OfflineWeb(isConnected);

// Create the middleware
const ga = GoogleAnalytics();
const gaMiddleware = createMiddleware(eventsMap, ga, { offlineStorage });
// Maybe: const metaReducer = createMetaReducer(eventsMap, target, { offlineStorage });

export default gaMiddleware;
