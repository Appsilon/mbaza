import { Action } from 'redux';

export const STATUS_ONLINE = 'STATUS_ONLINE';

export interface StatusOnlineAction extends Action {
  type: typeof STATUS_ONLINE;
  status: boolean;
}

export function statusOnline(status: boolean): StatusOnlineAction {
  return {
    type: STATUS_ONLINE,
    status
  };
}
