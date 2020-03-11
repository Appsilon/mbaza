import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { changeLogMessage } from '../actions/logMessage';
import Classifier from '../components/Classifier';
import { logMessageStateType } from '../reducers/types';

function mapStateToProps(state: logMessageStateType) {
  return {
    logMessage: state.logMessage
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      changeLogMessage
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Classifier);
