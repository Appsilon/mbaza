import {
  CHANGE_LOG_MESSAGE,
  ChangeLogMessageAction
} from '../actions/logMessage';

export default function logMessage(state = '', action: ChangeLogMessageAction) {
  switch (action.type) {
    case CHANGE_LOG_MESSAGE:
      return action.newLogMessage;
    default:
      return state;
  }
}
