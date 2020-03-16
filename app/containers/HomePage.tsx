import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { changeLogMessage } from '../actions/logMessage';
import { changeDirectoryChoice } from '../actions/directoryChoice';
import Classifier from '../components/Classifier';
import { classifierStateType } from '../reducers/types';

function mapStateToProps(state: classifierStateType) {
  return {
    logMessage: state.logMessage,
    directoryChoice: state.directoryChoice
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      changeLogMessage,
      changeDirectoryChoice
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Classifier);
