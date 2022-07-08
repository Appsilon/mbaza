import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Store } from '../reducers/types';
import Routes from '../Routes';

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store }: Props) => (
  <Provider store={store}>
    <HashRouter>
      <Routes />
    </HashRouter>
  </Provider>
);

export default hot(Root);
