export const CHANGE_LOG_MESSAGE = 'CHANGE_LOG_MESSAGE';

export interface ChangeLogMessageAction {
  type: typeof CHANGE_LOG_MESSAGE;
  newLogMessage: string;
}

export function changeLogMessage(newLogMessage: string) {
  return {
    type: CHANGE_LOG_MESSAGE,
    newLogMessage
  };
}
