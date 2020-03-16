import React, { ReactNode } from 'react';
import { Navbar, Alignment, Icon, Intent, Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { routes } from '../constants/RoutesType';
import Sidebar from '../components/Sidebar';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return (
    <>
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
            <strong>Mbaza</strong>
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
        {children}
      </div>
    </>
  );
}
