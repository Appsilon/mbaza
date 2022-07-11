import React from 'react';
import { HashRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import Routes from '../Routes';

const Root = () => (
  <HashRouter>
    <Routes />
  </HashRouter>
);

export default hot(Root);
