import React from 'react';
import styles from './Sidebar.css';

import SidebarItem from './SidebarItem';

export default function Sidebar() {
  return (
    <div
      className={styles.container}
      style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
    >
      <SidebarItem text="Classify" iconName="send-to-graph" />
      <SidebarItem text="Explore" iconName="search-template" />
    </div>
  );
}
