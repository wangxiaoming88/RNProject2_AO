import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform
} from 'react-native';

import { baseStyles } from '../styles';
import {reduxForm} from 'redux-form';

import TextInput from '../common/form/textInput';
import Icon from 'react-native-vector-icons/MaterialIcons';

let fields = ['fullName', 'email'];

class InviteParentsModal extends React.Component {
  submitForm(data) {
    console.log(data);
    this.props.onClose();
  }

  render() {
    let {
      fields: {fullName, email},
      handleSubmit
    } = this.props;

    var TextInputName;
    if (Platform.OS === 'android') {
      TextInputName = (
        <TextInput
          light
          placeholder="Full Name"
          autoCapitalize="words"
          {...fullName}   />
        );
    } else {
      TextInputName = (
        <TextInput
        style={{height: 40, color: 'black', fontSize: 15}}
        light
        placeholder="Full Name"
        autoCapitalize="words"
        {...fullName} />
      );
    }

    var TextInputEmail;
    if (Platform.OS === 'android') {
      TextInputEmail = (
        <TextInput
          light
          placeholder="E-mail"
          keyboardType="email-address"
          onSubmitEditing={ handleSubmit(this.submitForm.bind(this)) }
          {...email}  />
        );
    } else {
      TextInputEmail = (
        <TextInput
          style={{height: 40, color: 'black', fontSize: 15}}
          light
          placeholder="E-mail"
          keyboardType="email-address"
          onSubmitEditing={ handleSubmit(this.submitForm.bind(this)) }
          {...email}/>
      );
    }

    return (
      <View style={ [baseStyles.modal, styles.modal] }>
        <TouchableOpacity
          onPress={ this.props.onClose }
          style={ [baseStyles.centeredContainer, styles.closeButton] }>
          <View style={ baseStyles.buttonWithIcon }>
            <Icon size={ 40 } name="expand-more" color="#000" />
            <Text style={ [styles.closeButtonText,{fontSize:17}] }>Invite Parents to Watch Progress</Text>
          </View>
        </TouchableOpacity>
        <View style={ baseStyles.centeredContainer }>
          <Text style={ styles.description }>This allows your parent to sign off</Text>
          <Text style={ styles.description }>on your practice sessions. </Text>
        </View>

        <View style={ {marginTop: 30, marginBottom: 20} }>
          {TextInputName}
          {TextInputEmail}
        </View>

        <TouchableOpacity style={ [
            baseStyles.submitButton,
            baseStyles.submitButtonSecondary,
            {borderWidth: 0},
            {marginBottom: 50}
          ] }
          onPress={ handleSubmit(this.submitForm.bind(this)) } >
          <Text style={ [
              baseStyles.submitButtonText,
              baseStyles.submitButtonSecondaryText
            ] }>
            Invite Parent
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 20,
  },
  description: {
    color: 'gray',
    fontSize: 16
  },
  closeButton: {
    paddingVertical: 20
  },
  closeButtonText: {
    fontSize: 20,
    color: 'black'
  }
});

export default reduxForm({
  form: 'inviteParentModalForm',
  fields
})(InviteParentsModal);
