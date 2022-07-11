import React from 'react';
import { Switch, Route } from 'react-router';

import { routes } from './constants/Routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ExplorePage from './containers/ExplorePage';
import ClassifyPage from './containers/ClassifyPage';
import MediaToolsPage from './containers/MediaToolsPage';
import useAnalytics from './utils/useAnalytics';

export default function Routes() {
  useAnalytics();
  return (
    <App>
      <Switch>
        <Route path={routes.CLASSIFY.path} component={ClassifyPage} />
        <Route path={routes.EXPLORE.path} component={ExplorePage} />
        <Route path={routes.MEDIA_TOOLS.path} component={MediaToolsPage} />
        <Route path={routes.HOME.path} component={HomePage} />
      </Switch>
    </App>
  );
}
