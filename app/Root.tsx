import React from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { routes } from './constants/Routes';
import App from './containers/App';
import ClassifyPage from './containers/ClassifyPage';
import ExplorePage from './containers/ExplorePage';
import HomePage from './containers/HomePage';
import MediaToolsPage from './containers/MediaToolsPage';

function Root() {
  return (
    <HashRouter>
      <App>
        <Switch>
          <Route path={routes.CLASSIFY.path} component={ClassifyPage} />
          <Route path={routes.EXPLORE.path} component={ExplorePage} />
          <Route path={routes.MEDIA_TOOLS.path} component={MediaToolsPage} />
          <Route path={routes.HOME.path} component={HomePage} />
        </Switch>
      </App>
    </HashRouter>
  );
}

export default hot(Root);
