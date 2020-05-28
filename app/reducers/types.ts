import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type classifierStateType = {
  isConnected: boolean;
  logMessage?: string;
  classify?: {
    directoryChoice: string;
    savePath: string;
  };
};

export type GetState = () => classifierStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<classifierStateType, Action<string>>;
