export const LOG_ERROR = 'LOG_ERROR';

export interface RuntimeErrorDescription {
  message: string | Event;
  url: string | undefined;
  line: number | undefined;
  column: number | undefined;
  error: Error | undefined;
  state: unknown;
}

export interface LogErrorAction {
  type: typeof LOG_ERROR;
  error: RuntimeErrorDescription;
  meta: { track: (action: LogErrorAction) => unknown };
}

export function logError(error: RuntimeErrorDescription): LogErrorAction {
  return {
    type: LOG_ERROR,
    error,
    meta: {
      track: (action: LogErrorAction) => ({
        hit: 'event',
        category: 'error',
        action
      })
    }
  };
}
