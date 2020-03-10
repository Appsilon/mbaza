import React from 'react';
import { withRouter } from 'react-router';
import styles from './Sidebar.css';

import SidebarItem from './SidebarItem';
import { RouteType, RoutesType } from '../constants/RoutesType';

// TODO(wojtek): fix the typing issue here
function Sidebar(props: RoutesType) {
  const { routes } = props;

  return (
    <div
      className={styles.container}
      style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
    >
      {Object.values(routes).map((route: RouteType) => (
        <SidebarItem
          key={route}
          text={route.name}
          iconName={route.iconName}
          link={route.path}
          active={props.location.pathname === route.path}
        />
      ))}
    </div>
  );
}

export default withRouter(Sidebar);
