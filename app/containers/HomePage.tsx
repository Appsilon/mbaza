import React from 'react';
import { Navbar, Alignment } from '@blueprintjs/core';

import Home from '../components/Home';
import Sidebar from '../components/Sidebar';

export default function HomePage() {
  return (
    <div>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Mbaza</Navbar.Heading>
        </Navbar.Group>
      </Navbar>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Sidebar />
        <Home />
      </div>
    </div>
  );
}
