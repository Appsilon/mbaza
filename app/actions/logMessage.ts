export const CHANGE_LOG_MESSAGE = 'CHANGE_LOG_MESSAGE';

export interface ChangeLogMessageAction {
  type: typeof CHANGE_LOG_MESSAGE;
  newLogMessage: string;
  meta: {
    track: (action: unknown) => unknown;
  };
}

export function changeLogMessage(
  newLogMessage: string
): ChangeLogMessageAction {
  return {
    type: CHANGE_LOG_MESSAGE,
    newLogMessage,
    meta: {
      track: (action: unknown) => ({
        hit: 'event',
        category: 'category',
        action,
        label: 'label',
        value: 'value'
      })
    }
  };
}
