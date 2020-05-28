export const STATUS_ONLINE = 'STATUS_ONLINE';

export interface StatusOnlineAction {
  type: typeof STATUS_ONLINE;
  status: boolean;
}

export function statusOnline(status: boolean): StatusOnlineAction {
  return {
    type: STATUS_ONLINE,
    status
  };
}
