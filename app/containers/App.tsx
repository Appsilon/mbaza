import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar, Alignment, Button, Popover, Menu, MenuItem } from '@blueprintjs/core';

import { routes } from '../constants/Routes';
import Sidebar from '../components/Sidebar';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  const { t, i18n } = useTranslation();

  return (
    <>
      <Navbar className="bp3-dark">
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>
            <img src="assets/icon.png" style={{ width: '32px', height: '32px' }} alt="Mbaza" />
          </Navbar.Heading>
          <Navbar.Heading>
            <strong>Mbaza</strong>
          </Navbar.Heading>
          <Navbar.Divider />
          <span>{t('topbar.title')}</span>
        </Navbar.Group>

        <Navbar.Group align={Alignment.RIGHT}>
          <Popover>
            <Button className="bp3-minimal" icon="globe" />
            <Menu>
              <MenuItem text="English" onClick={() => i18n.changeLanguage('en')} />
              <MenuItem text="Français" onClick={() => i18n.changeLanguage('fr')} />
            </Menu>
          </Popover>
        </Navbar.Group>
      </Navbar>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Sidebar routes={routes} />
        {children}
      </div>
    </>
  );
}
