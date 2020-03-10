import React from 'react';
import styles from './Sidebar.css';

import SidebarItem from './SidebarItem';
import { RouteType, RoutesType } from '../constants/RoutesType';

export default function Sidebar(props: RoutesType) {
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
          active={false}
        />
      ))}
    </div>
  );
}
