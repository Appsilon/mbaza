export const CHANGE_DIRECTORY_CHOICE = 'CHANGE_DIRECTORY_CHOICE';
export const CHANGE_SAVE_PATH_CHOICE = 'CHANGE_SAVE_PATH_CHOICE';

export interface ChangeDirectoryChoiceAction {
  type: typeof CHANGE_DIRECTORY_CHOICE;
  newDirectoryChoice: string;
  meta: {
    track: (action: unknown) => unknown;
  };
}

export function changeDirectoryChoice(
  newDirectoryChoice: string
): ChangeDirectoryChoiceAction {
  return {
    type: CHANGE_DIRECTORY_CHOICE,
    newDirectoryChoice,
    meta: {
      track: () => ({ hit: 'pageview' })
    }
  };
}

export interface ChangeSavePathChoiceAction {
  type: typeof CHANGE_SAVE_PATH_CHOICE;
  newSavePathChoice: string;
}

export function changeSavePathChoice(
  newSavePathChoice: string
): ChangeSavePathChoiceAction {
  return {
    type: CHANGE_SAVE_PATH_CHOICE,
    newSavePathChoice
  };
}
