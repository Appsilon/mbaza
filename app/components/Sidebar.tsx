import React from 'react';
import styles from './Sidebar.css';

import SidebarItem from './SidebarItem';
import routes from '../constants/routes.json';

export default function Sidebar() {
  return (
    <div
      className={styles.container}
      style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
    >
      <SidebarItem text="Home" iconName="home" link={routes.HOME.path} active />
      <SidebarItem
        text="Counter"
        iconName="pulse"
        link={routes.COUNTER.path}
        active={false}
      />
      <SidebarItem
        text="Classify"
        iconName="send-to-graph"
        link={routes.CLASSIFY.path}
        active={false}
      />
      <SidebarItem
        text="Explore"
        iconName="search-template"
        link={routes.EXPLORE.path}
        active={false}
      />
    </div>
  );
}
