import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type counterStateType = {
  counter: number;
};

export type logMessageStateType = {
  logMessage: string;
};

export type GetState = () => counterStateType;

export type GetLogMessageState = () => logMessageStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<counterStateType, Action<string>>;
