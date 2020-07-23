export const CHANGE_LOG_MESSAGE = 'CHANGE_LOG_MESSAGE';

export interface ChangeLogMessageAction {
  type: typeof CHANGE_LOG_MESSAGE;
  newLogMessage: string | null;
}

export function changeLogMessage(newLogMessage: string | null) {
  return {
    type: CHANGE_LOG_MESSAGE,
    newLogMessage
  };
}
