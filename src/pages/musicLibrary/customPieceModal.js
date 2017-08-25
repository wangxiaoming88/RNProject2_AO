import React from 'react';
import {
  View,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';

import {fontAndroidThin,fontAndroidLight,fontIOSThin,fontIOSLight} from '../../components/fonts.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageSwitcher from '../../components/joinNewClass/pageSwitcher';
import {reduxForm} from 'redux-form';
import Utils from '../../services/utils';

import {fetchMyPractices, subscribePracticePiece} from '../../redux/actions/practice';
import {addNewPractice} from '../../redux/actions/practice';

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

let fields = ['title'];

/**
 * Validates form data.
 * @param  {Object} values - serialized form
 * @return {Object}        - errors object
 */
function validate(values) {
  let errors = {};

  if (!values.title) {
    errors.title = 'This field is required';
  }

  return errors;
}

class CustomPieceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  changeActiveTab(tabId) {
    this.setState({activeTab: tabId});
  }

  _submit(data) {
    this.props.dispatch(addNewPractice(data.title, (res) => {
        Alert.alert('Add Practice', 'Practice successfully added');
        this.props.dispatch(subscribePracticePiece(res.url, () => {
        this.props.dispatch(fetchMyPractices());
        this.props.onClose();
      }), Utils.parseServerError);

    }, Utils.parseServerError));
  }

  render() {
    let {
      handleSubmit,
      fields: {
        title
      }
    } = this.props;
    return (
        <View
          style={{
            flex:1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#4ecfb7',
              width: width - 30,
              height: (width === 320) ? height / 2.2 : height / 2,
              justifyContent: 'flex-start',
              borderRadius: 10,
            }}
          >
            <Image
              source={ (Platform.OS === 'ios') ? { uri: 'animation.gif'} : require('./../../../images/animation.gif') }
              style={{
                //backgroundColor: '#4ecfb7',
                //flex: 1,
                marginTop: (Platform.OS === 'ios') ? 0 : 5,
                width: width - 30,
                height: 115,
                borderRadius: 10,
                //borderTopRightRadius: 10,
              }}
              resizeMode={'contain'}
            >
              <View
                style={{ flexDirection: 'row', backgroundColor: 'transparent'}}
              >
                <TouchableOpacity
                  style={{
                    // position:'absolute',
                    // left: 0,
                    // top: 0,
                    backgroundColor: 'transparent',
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => this.props.onClose()}
                >
                  <Icon
                    name={'close'}
                    size={20}
                    color={'white'}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    paddingTop: 11,
                    paddingRight: 40,
                  }}
                >
                  Custom Practice Piece
                </Text>
              </View>
            </Image>
            <View
              style={{
                flex: 1,
                backgroundColor: '#EFEFF4',
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              <View
                style={{
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: '#6D6D72',
                    fontSize: 13,
                    paddingLeft: 10,
                    paddingBottom: 5,
                  }}
                >
                  PRACTICE PIECE TITLE
                </Text>
                <TextInput
                  autoCorrect={false}
                  autoFocus={false}
                  keyboardType={'default'}
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    height: 40,
                    paddingLeft: 10,
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: 'black',
                  }}
                  onSubmitEditing={ handleSubmit(this._submit.bind(this))}
                  { ...title }
                />
              </View>
              <TouchableOpacity
                onPress={ handleSubmit(this._submit.bind(this)) }
                style={ [styles.submitButton, styles.submitButtonSecondary] }>
                <Text
                  style={ [styles.textThinPlatform, styles.submitButtonText, styles.submitButtonSecondaryText] }>Create Custom
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );
  }
}

export default reduxForm({
  form: 'addNewModalForm',
  fields,
  validate
})(CustomPieceModal);
