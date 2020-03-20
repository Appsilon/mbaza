import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navbar,
  Alignment,
  Icon,
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

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
          <span>{t('AI for species discovery')}</span>
        </Navbar.Group>

        <Navbar.Group align={Alignment.RIGHT}>
          <Button
            className="bp3-minimal"
            icon="projects"
            text={t('Projects')}
            style={{ color: '#fff' }}
          />
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="user" />
          <Button className="bp3-minimal" icon="notifications" />
          <Popover>
            <Button className="bp3-minimal" icon="globe" />
            <Menu>
              <MenuItem
                text="English"
                onClick={() => i18n.changeLanguage('en')}
              />
              <MenuItem
                text="Française"
                onClick={() => i18n.changeLanguage('fr')}
              />
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
