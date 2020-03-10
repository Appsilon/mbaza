import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styles from './Sidebar.css';

import SidebarItem from './SidebarItem';
import { RoutesType } from '../constants/RoutesType';

interface Props extends RouteComponentProps<any> {
  routes: RoutesType;
  location: any;
}

function Sidebar(props: Props) {
  const { routes, location } = props;

  return (
    <div
      className={styles.container}
      style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
    >
      {Object.keys(routes).map((key: string) => (
        <SidebarItem
          key={routes[key].name}
          text={routes[key].name}
          iconName={routes[key].iconName}
          link={routes[key].path}
          active={location.pathname === routes[key].path}
        />
      ))}
    </div>
  );
}

export default withRouter(Sidebar);
