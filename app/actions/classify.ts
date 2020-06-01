export const CHANGE_DIRECTORY_CHOICE = 'CHANGE_DIRECTORY_CHOICE';
export const CHANGE_SAVE_PATH_CHOICE = 'CHANGE_SAVE_PATH_CHOICE';

export interface ChangeDirectoryChoiceAction {
  type: typeof CHANGE_DIRECTORY_CHOICE;
  newDirectoryChoice: string;
}

export function changeDirectoryChoice(newDirectoryChoice: string) {
  return {
    type: CHANGE_DIRECTORY_CHOICE,
    newDirectoryChoice
  };
}

export interface ChangeSavePathChoiceAction {
  type: typeof CHANGE_SAVE_PATH_CHOICE;
  newSavePathChoice: string;
}

export function changeSavePathChoice(newSavePathChoice: string) {
  return {
    type: CHANGE_SAVE_PATH_CHOICE,
    newSavePathChoice
  };
}
