import { STATUS_ONLINE, StatusOnlineAction } from '../actions/online';

export default function online(state = { isConnected: false }, action: StatusOnlineAction) {
  switch (action.type) {
    case STATUS_ONLINE:
      return { ...state, isConnected: action.status };
    default:
      return state;
  }
}
