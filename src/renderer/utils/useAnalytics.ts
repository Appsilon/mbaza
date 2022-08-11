import { machineIdSync } from 'node-machine-id';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Analytics from 'universal-analytics';

// Meaningless for us, but required by Google Analytics Measurement Protocol:
// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dh
const HOST = 'electron';

// The `machineIdSync()` is not in UUID v4 format, so we must pass `strictCidFormat: false`.
const analytics = Analytics('UA-167871460-1', machineIdSync(), { strictCidFormat: false });

export default function useAnalytics() {
  const location = useLocation();
  useEffect(() => {
    analytics.pageview({ dh: HOST, dp: location.pathname }).send();
  }, [location]);
}
