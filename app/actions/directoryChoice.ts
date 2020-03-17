export const CHANGE_DIRECTORY_CHOICE = 'CHANGE_DIRECTORY_CHOICE';

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
