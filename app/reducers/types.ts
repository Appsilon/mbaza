import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type classifierStateType = {
  online: {
    isConnected: boolean;
  };
};

export type GetState = () => classifierStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<classifierStateType, Action<string>>;
