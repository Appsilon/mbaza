import React from 'react';
import { Switch, Route } from 'react-router';
import { Navbar, Alignment } from '@blueprintjs/core';
import { routes } from './constants/RoutesType';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import ExplorePage from './containers/ExplorePage';
import ClassifyPage from './containers/ClassifyPage';
import Sidebar from './components/Sidebar';

export default function Routes() {
  return (
    <App>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>MBaza</Navbar.Heading>
        </Navbar.Group>
      </Navbar>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Sidebar routes={routes} />
        <Switch>
          <Route path={routes.CLASSIFY.path} component={ClassifyPage} />
          <Route path={routes.EXPLORE.path} component={ExplorePage} />
          <Route path={routes.COUNTER.path} component={CounterPage} />
          <Route path={routes.HOME.path} component={HomePage} />
        </Switch>
      </div>
    </App>
  );
}
