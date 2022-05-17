import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './Sidebar.scss';

import SidebarItem from './SidebarItem';
import { RoutesType } from '../constants/Routes';

interface Props extends RouteComponentProps {
  routes: RoutesType;
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
      <div style={{ position: 'absolute', bottom: 0 }}>
        Developed with <span style={{ color: '#0099f9' }}>💙</span> by
        <img
            // style={logoStyle}
            src="assets/logos/appsilon-white.png"
            alt="Appsilon"
            style={{ width: '100%' }}
          />
      </div>
    </div>
  );
}

export default withRouter(Sidebar);
