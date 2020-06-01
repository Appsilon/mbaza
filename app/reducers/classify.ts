import {
  CHANGE_DIRECTORY_CHOICE,
  CHANGE_SAVE_PATH_CHOICE,
  ChangeDirectoryChoiceAction,
  ChangeSavePathChoiceAction
} from '../actions/classify';

export default function classify(
  state = { directoryChoice: '', savePath: '' },
  action: ChangeDirectoryChoiceAction | ChangeSavePathChoiceAction
) {
  switch (action.type) {
    case CHANGE_DIRECTORY_CHOICE:
      return { ...state, directoryChoice: action.newDirectoryChoice };
    case CHANGE_SAVE_PATH_CHOICE:
      return { ...state, savePath: action.newSavePathChoice };
    default:
      return state;
  }
}
