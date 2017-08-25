import React from 'react';
import {
  View,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';

import { connect } from 'redux';
//import TextInput from '../../components/common/form/textInput';
import Utils from '../../services/utils';
import {reduxForm} from 'redux-form';
import {fontAndroidThin,fontAndroidLight,fontIOSThin,fontIOSLight} from '../../components/fonts.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageSwitcher from '../../components/joinNewClass/pageSwitcher';
import { createGoal } from '../../redux/actions/goals';
const { width, height } = Dimensions.get('window');

const baseColor   = '#2699d3';
const secondColor = '#2497d0';

var fontThin = function() {
  return (Platform.OS === 'android') ? fontAndroidThin : fontIOSThin;
};

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  submitButtonText: {
    fontFamily: fontThin(),
    color: baseColor,
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'center',
  },
  submitButtonSecondary: {
    backgroundColor: baseColor,
    marginVertical: 15,
    marginHorizontal: 10,
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: 'white',
  },
  textThinPlatform: {
    fontFamily: fontThin()
  },
  submitButtonSecondaryText: {
    color: 'white'
  },
  separator: {
    borderWidth: 0.3,
    borderColor: '#C8C7CC',
  }
});

let fields = ['duration', 'piece'];

/**
 * Validates form data.
 * @param  {Object} values - serialized form
 * @return {Object}        - errors object
 */
function validate(values) {
  let errors = {};

  // if (!values.name) {
  //   errors.name = 'This field is required';
  // } else
  if (!values.duration) {
    errors.duration = 'This field is required';
  }
  //  else if (!values.piece) {
  //   errors.piece = 'This field is required';
  // }

  return errors;
}

class ModalListPiece extends React.Component {
  constructor() {
    super();
    this.state = {
      timeGoal: 0,
      activeTab: 0,
      pieceTitle: '',
      modalIsVisible: false,
    };
    this.piece = {};
    this.addPiece = this.addPiece.bind(this);
    this.setPiece = this.setPiece.bind(this);
  }

  changeActiveTab(tabId) {
    this.setState({activeTab: tabId});
  }

  _submit(data) {
    this.props.dispatch(createGoal(data.name, data.duration, data.piece, this.state.activeTab, (res) => {
      Alert.alert('Create Goal', 'Goal successfully created');
      this.props.onClose();
    }, Utils.parseServerError));
  }

  setPiece(data) {
    this.piece = data;
    this.setState({ pieceTitle: data.title });
  }
  addPiece() {
    //this.props.onClose();
    this.props.navigator.push({ id: 'seeAllMusicLibrary', callBack: this.setPiece });
  }

  render() {
    return (
      null
    );
  }
}

export default connect()(ModalListPiece);
