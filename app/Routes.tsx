import React from 'react';
import { Switch, Route } from 'react-router';

import { Navbar, Alignment, Icon, Intent, Button } from '@blueprintjs/core';

import { IconNames } from '@blueprintjs/icons';

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
      <Navbar className="bp3-dark">
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>
            <Icon
              icon={IconNames.MAP}
              iconSize={Icon.SIZE_LARGE}
              intent={Intent.PRIMARY}
            />
          </Navbar.Heading>
          <Navbar.Heading>
            <strong>MBaza</strong>
          </Navbar.Heading>
          <Navbar.Divider />
          <span>AI for species discovery</span>
        </Navbar.Group>

        <Navbar.Group align={Alignment.RIGHT}>
          <Button
            className="bp3-minimal"
            icon="projects"
            text="Projects"
            style={{ color: '#fff' }}
          />
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="user" />
          <Button className="bp3-minimal" icon="notifications" />
          <Button className="bp3-minimal" icon="cog" />
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
