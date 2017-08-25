import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { baseStyles } from '../styles';
import {reduxForm} from 'redux-form';

import TextInput from '../common/form/textInput';
import Icon from 'react-native-vector-icons/MaterialIcons';

let fields = ['message'];

function validate(values) {
  let errors = {};

  if (!values.message) {
    errors.message = 'This field is required';
  }

  return errors;
}

class SendTeacherMessageModal extends React.Component {
  submitQuestion(data) {
    this.props.onSubmitHandler(data);
    this.props.onClose();
  }

  render() {
    let {
      fields: {message},
      handleSubmit
    } = this.props;

    return (
      <View style={ [baseStyles.modal, styles.newModal] }>
        <View style={{marginTop: 8,flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={ [styles.closeButton, ] }
            onPress={ this.props.onClose }>
            <Icon name="close" size={ 30 } color="#000" />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text style={ styles.description }>Type your message here</Text>
          </View>
        </View>
        
        <View style={styles.viewTextinput}>
          <TextInput
            light
            noborder
            multiline
            style={ styles.input }
            // style={{backgroundColor: 'yellow'}}
            maxLength={200}
            // style={{height: 40, color: 'black',fontSize: 15}}
            { ...message } />
        </View>

        <TouchableOpacity
          style={[
            baseStyles.submitButton,
            baseStyles.submitButtonSecondary,
            {borderWidth: 0},
            {marginTop: 20}
          ]}
          onPress={ handleSubmit(this.submitQuestion.bind(this)) } >
          <Text style={ [
              baseStyles.submitButtonText,
              baseStyles.submitButtonSecondaryText
            ] }>
            Send Question
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  closeButton: {
    flex: 0.1,
  },
  modal: {
    margin: 16,
    padding: 16,
  },
  description: {
    color: 'black',
    fontSize: 16
  },
  input: {
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: 'lightgray',
    height: 134,
    // borderRadius: 8,
    // padding: 20,
    fontSize: 16,
    textAlignVertical: 'top',

  },
  closeButtonText: {
    fontSize: 20,
    color: 'black'
  },
  newModal: {
    height: Dimensions.get('window').height - Dimensions.get('window').height / 8,
    paddingHorizontal: 8,
    flex: 1,
  },
  viewTextinput: {
    marginTop: 8,
    // flex: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'lightgray',
    height: 150,
    borderRadius: 8,
    // padding: 8,
    paddingHorizontal: 8,
  },
});

export default reduxForm({
  form: 'SendTeacherMessageModalForm',
  fields,
  validate
})(SendTeacherMessageModal);
