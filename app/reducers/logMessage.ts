import { CHANGE_LOG_MESSAGE, ChangeLogMessageAction } from '../actions/logMessage';

export default function logMessage(state = '', action: ChangeLogMessageAction) {
  switch (action.type) {
    case CHANGE_LOG_MESSAGE:
      if (action.newLogMessage == null) {
        return '';
      }
      if (state !== '') {
        return `${state}\n${action.newLogMessage}`;
      }
      return action.newLogMessage;
    default:
      return '';
  }
}
