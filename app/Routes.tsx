import React from 'react';
import { Switch, Route } from 'react-router';

import { routes } from './constants/Routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ExplorePage from './containers/ExplorePage';
import ClassifyPage from './containers/ClassifyPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.CLASSIFY.path} component={ClassifyPage} />
        <Route path={routes.EXPLORE.path} component={ExplorePage} />
        <Route path={routes.HOME.path} component={HomePage} />
      </Switch>
    </App>
  );
}
