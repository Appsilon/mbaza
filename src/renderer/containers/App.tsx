import { Alignment, Button, Menu, MenuItem, Navbar, Popover } from '@blueprintjs/core';
import { useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Sidebar from '../components/Sidebar';
import { routes } from '../constants/Routes';
import useAnalytics from '../utils/useAnalytics';
import styles from './App.module.scss';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  const { t, i18n } = useTranslation();
  useAnalytics();

  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  return (
    <>
      <Navbar className={`${styles.navbar} bp4-dark`}>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>
            <img className={styles.logo} src="file:///assets/icon.png" alt="Mbaza" />
          </Navbar.Heading>
          <Navbar.Heading>
            <strong>Mbaza</strong>
          </Navbar.Heading>
          <Navbar.Divider />
          <span>{t('topbar.title')}</span>
        </Navbar.Group>

        <Navbar.Group align={Alignment.RIGHT}>
          <Popover>
            <Button className="bp4-minimal" icon="globe" />
            <Menu>
              <MenuItem text="English" onClick={() => i18n.changeLanguage('en')} />
              <MenuItem text="Français" onClick={() => i18n.changeLanguage('fr')} />
            </Menu>
          </Popover>
        </Navbar.Group>
      </Navbar>
      <main className={styles.main}>
        <Sidebar routes={routes} />
        {children}
      </main>
    </>
  );
}
