import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native';

import { baseStyles } from '../styles';
import TextInput from '../../components/common/form/textInput';

import {sendPasswordResetRequest} from '../../redux/actions/user';
import validationPatterns from '../../services/validationPatterns';
import Utils from '../../services/utils';

import {reduxForm} from 'redux-form';

let fields = ['email'];

/**
 * Validates form data.
 * @param  {Object} values - serialized form
 * @return {Object}        - errors object
 */
function validate(values) {
  let errors = {};

  if (!values.email) {
    errors.email = 'This field is required';
  } else if (!values.email.match(validationPatterns.email)) {
    errors.email = 'This email is not valid';
  }

  return errors;
}

class ForgotPasswordModal extends React.Component {
  sendRecoveryRequest(data) {
    this.props.dispatch(sendPasswordResetRequest(data.email, () => {
      Alert.alert('Password restore', 'Request submitted successfully');
      this.props.onClose();
    }, Utils.parseServerError));
  }

  render() {
    let {
      handleSubmit,
      fields: {
        email
      }
    } = this.props;

    return (
      <View style={ [baseStyles.centeredContainer, {flex: 1}] }>
        <View style={ [baseStyles.modal, styles.modal] }>
          <Text style={ styles.description }>
            Type your email here and we will send you restore instructions.
          </Text>
          <TextInput
            light
            placeholder="E-mail"
            keyboardType="email-address"
            onSubmitEditing={ handleSubmit(this.sendRecoveryRequest.bind(this)) }
            { ...email }
          />
          <View style={ baseStyles.twoInputWrapper }>
            <TouchableOpacity
              style={ [baseStyles.submitButton, baseStyles.submitButtonSecondary, baseStyles.twoInputWrapperItem] }
              onPress={ handleSubmit(this.sendRecoveryRequest.bind(this)) }>
              <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText] }>
                Send
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ [baseStyles.submitButton, baseStyles.twoInputWrapperItem] }
              onPress={ this.props.onClose }>
              <Text style={ baseStyles.submitButtonText }>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  modal: {
    bottom: null,
    left: null,
    right: null,
    alignSelf: 'center',
    position: 'relative',
    flex: 0
  },
  description: {
    fontSize: 16,
    color: 'black',
    margin: 20,
    textAlign: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10
  },
});

export default reduxForm({
  form: 'forgotPasswordModalForm',
  fields,
  validate
})(ForgotPasswordModal);
