import {
  CHANGE_DIRECTORY_CHOICE,
  ChangeDirectoryChoiceAction
} from '../actions/directoryChoice';

export default function directoryChoice(
  state = '',
  action: ChangeDirectoryChoiceAction
) {
  switch (action.type) {
    case CHANGE_DIRECTORY_CHOICE:
      return action.newDirectoryChoice;
    default:
      return state;
  }
}
