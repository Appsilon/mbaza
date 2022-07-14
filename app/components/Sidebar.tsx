import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './Sidebar.module.scss';

import SidebarItem from './SidebarItem';
import { RoutesType } from '../constants/Routes';

interface Props extends RouteComponentProps {
  routes: RoutesType;
}

function Footer() {
  return (
    <div className={styles.footer}>
      Developed with
      <span className={styles.heart} role="img" aria-label="love">
        {' 💙 '}
      </span>
      by
      <a className={styles.logoLink} href="https://appsilon.com/" target="_blank" rel="noreferrer">
        <img className={styles.logoImg} src="assets/logos/appsilon-white.png" alt="Appsilon" />
      </a>
    </div>
  );
}

function Sidebar(props: Props) {
  const { routes } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {Object.keys(routes).map((key: string) => (
        <SidebarItem
          key={routes[key].name}
          text={t(routes[key].name)}
          iconName={routes[key].iconName}
          link={routes[key].path}
          active={props.location.pathname === routes[key].path}
        />
      ))}
      <Footer />
    </div>
  );
}

export default withRouter(Sidebar);
