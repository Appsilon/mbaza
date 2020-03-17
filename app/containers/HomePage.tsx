import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { changeLogMessage } from '../actions/logMessage';
import {
  changeDirectoryChoice,
  changeSavePathChoice
} from '../actions/classify';
import Classifier from '../components/Classifier';
import { classifierStateType } from '../reducers/types';

function mapStateToProps(state: classifierStateType) {
  return {
    logMessage: state.logMessage,
    directoryChoice: state.classify.directoryChoice,
    savePath: state.classify.savePath
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      changeLogMessage,
      changeDirectoryChoice,
      changeSavePathChoice
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Classifier);
