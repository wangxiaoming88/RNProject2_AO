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

//import TextInput from '../../components/common/form/textInput';
import Utils from '../../services/utils';
//import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { fontAndroidThin, fontAndroidLight, fontIOSThin, fontIOSLight } from '../../components/fonts.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageSwitcher from '../../components/joinNewClass/pageSwitcher';
import {
  createGoal,
  editGoal,
  deleteGoal,
  saveInterimDataGoal,
  cleanInterimDataGoal
} from '../../redux/actions/goals';
const { width, height } = Dimensions.get('window');

const baseColor   = '#2699d3';
const secondColor = '#2497d0';

let fontThin = function() {
  return (Platform.OS === 'android') ? fontAndroidThin : fontIOSThin;
};

//let fields = ['duration', 'piece'];

/**
 * Validates form data.
 * @param  {Object} values - serialized form
 * @return {Object}        - errors object
 */
/*function validate(values) {
  let errors = {};

  // if (!values.name) {
  //   errors.name = 'This field is required';
  // } else
  /!*if (!values.duration) {
    errors.duration = 'This field is required';
  }*!/
  //  else if (!values.piece) {
  //   errors.piece = 'This field is required';
  // }

  return errors;
}*/

class EditCreateGoalModal extends React.Component {
  constructor() {
    super();
    this.state = {
      duration: null,
      intervalTab: 0, // 0 == week, 1 == month
      pieceTitle: null,
      pieceUrl: null,
    };
    this.piece = {};
  };

  componentDidMount = () => {
    if (this.props.isEdit) { this.setInitialEditValues() }
    if (Object.keys(this.props.goals.interimDataGoal).length) {
      this.setInitialInterimValues();
    }
  };

  setInitialEditValues = () => {
    let { goal } = this.props;
    console.log('INITIAL_EDIT_GOAL', goal);
    let _interval = goal.interval === 'week' ? 0 : 1;
    let _pieceTitle = goal.piece && goal.piece.title;
    let _pieceUrl = goal.piece && goal.piece.url;
    this.setState({
      duration: String(goal.duration),
      intervalTab: _interval,
      pieceTitle: _pieceTitle,
      pieceUrl: _pieceUrl,
    });
  };

  setInitialInterimValues = () => {
    let data = this.props.goals.interimDataGoal;
    let { duration, intervalTab, pieceTitle, pieceUrl } = data;
    this.setState({
      duration: duration ? String(duration) : '',
      intervalTab,
      pieceTitle,
      pieceUrl,
    });
  };

  cleanInterimData = () => {
    if (Object.keys(this.props.goals.interimDataGoal).length) {
      this.props.dispatch(cleanInterimDataGoal());
    }
  };

  setIntervalTab = (tabId) => {
    this.setState({ intervalTab: tabId });
  };

  _createGoal = () => {
    let { duration, intervalTab, pieceUrl } = this.state;
    this.props.createGoal(duration, intervalTab, pieceUrl);
    this.cleanInterimData();
  };

  _editGoal = () => {
    let { duration, intervalTab, pieceUrl } = this.state;
    this.props.editGoal(duration, intervalTab, pieceUrl);
    this.cleanInterimData();
  };

  _deleteGoal = () => {
    this.props.deleteGoal();
    this.cleanInterimData();
  };

  getDeleteButton = () => {
    if (this.props.isEdit) {
      return (
        <TouchableOpacity
          onPress={ () => this._deleteGoal() }
          style={ [styles.submitButton, styles.submitButtonSecondary, { backgroundColor: '#EFEFF4', height: 35 }] }>
          <Text
            style={ [styles.textThinPlatform, styles.submitButtonText, styles.submitButtonSecondaryText, { color: 'red', paddingBottom: 15 }] }
          >
            Delete Goal
          </Text>
        </TouchableOpacity>
      )
    }
  };

  addPiece = () => {
    let { duration, intervalTab, pieceTitle, pieceUrl } = this.state;
    this.props.onCloseModal();
    this.props.dispatch(saveInterimDataGoal({
      duration,
      intervalTab,
      pieceTitle,
      pieceUrl,
    }));
    this.props.navigator.push({
      id: 'seeAllMusicLibrary',
      editingCreatingGoal: true,
      showModal: this.props.onShowModal
    });
  };

  render() {
    let { isEdit } = this.props;
    return (
        <View style={ styles.container }>
          <View style={ styles.modalContainer }>
            <Image
              style={ styles.headerGif }
              source={ (Platform.OS === 'ios')
                ? { uri: 'animation.gif' }
                : require('./../../../images/animation.gif')
              }
              resizeMode={ 'contain' }
            >
              <View style={ styles.headerContainer }>
                <TouchableOpacity
                  style={ styles.headerIconClose }
                  onPress={ () => {
                    this.props.onCloseModal();
                    this.cleanInterimData();
                  }}
                >

                  <Icon name={ 'close' } size={ 20 } color={ 'white' } />
                </TouchableOpacity>
                <Text style={ styles.headerTitle }>
                  { this.props.isEdit ? 'Edit Goal' : 'Create Goal' }
                </Text>
              </View>
            </Image>
            <View style={ styles.formContainer }>
              <View style={ styles.labelContainer }>
                <Text style={ styles.label }>
                  TIME GOAL (HOURS)
                </Text>
                <TextInput
                  autoCorrect={ false }
                  autoFocus={ false }
                  keyboardType={ 'numeric' }
                  style={ styles.timeInput }
                  value={ this.state.duration }
                  onChangeText={ number => this.setState({ duration: String(number) })}
                  onSubmitEditing={ isEdit ? this._edit : this._submit }
                  //{ ...duration }
                />
              </View>
              <PageSwitcher
                //light
                goal
                onChange={ this.setIntervalTab }
                activeTab={ this.state.intervalTab }
                tabs={ ['Per Week', 'Per Month'] }
                style={{
                  switcherButton: { padding: 5 },
                  switcherButtonText: { fontSize: (Dimensions.get('window').width === 320) ? 12 : 13 }
                }}
              />
              <View style={ styles.labelContainer }>
                <Text style={ styles.label }>
                  LINK TO PIECE
                </Text>
                <TouchableOpacity
                  style={ styles.pieceSelect }
                  onPress={ !this.props.fromLibrary ? this.addPiece : null }
                >
                  <Text>
                    { this.state.pieceTitle ? this.state.pieceTitle : 'Add Piece' }
                  </Text>
                  {
                    !this.props.fromLibrary && <Icon name={ 'keyboard-arrow-right' } size={ 25 } color={ '#C7C7CC'} />
                  }
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={ isEdit ? this._editGoal : this._createGoal }
                style={ [styles.submitButton, styles.submitButtonSecondary] }>
                <Text
                  style={ [styles.textThinPlatform, styles.submitButtonText, styles.submitButtonSecondaryText] }
                >
                  { this.props.isEdit ? 'Edit Goal' : 'Create Goal' }
                </Text>
              </TouchableOpacity>
              { this.getDeleteButton() }
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#4ecfb7',
    width: width - 30,
    height:  (Platform.OS === 'ios') ? ((width === 320) ? height - 120 : height / 1.7) : height / 1.3,
    justifyContent: 'flex-start',
    borderRadius: 10,
  },
  headerGif: {
    //backgroundColor: '#4ecfb7',
    //flex: 1,
    marginTop: (Platform.OS === 'ios') ? 0 : 4,
    width: width - 30,
    height: 115,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  headerIconClose: {
    // position:'absolute',
    // left: 0,
    // top: 0,
    backgroundColor: 'transparent',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    paddingTop: 11,
    paddingRight: 40,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  labelContainer: {
    marginTop: 20,
  },
  label: {
    color: '#6D6D72',
    fontSize: 13,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'black',
  },
  pieceSelect: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
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

/*EditCreateGoalModal = reduxForm({
  form: 'addNewModalForm',
  fields,
  validate
})(EditCreateGoalModal);*/

function props(state) {
  return {
    goals: state.goals
  };
}

export default connect(props)(EditCreateGoalModal);
