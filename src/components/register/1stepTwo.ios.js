import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar
} from 'react-native';


import {baseStyles, baseColor} from '../../components/styles';
import styles from '../../pages/authorize/styles';

import TextInput from '../../components/common/form/textInput';
import {reduxForm} from 'redux-form';

import PageTitle from '../../components/common/pageTitle';

import validationPatterns from '../../services/validationPatterns';
import LinearGradient from 'react-native-linear-gradient';

let fields = ['name', 'email', 'password'];
function validate(values) {
  let errors = {};

  if (!values.name) {
    errors.name = 'This field is required';
  }

  if (!values.password) {
    errors.password = 'This field is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be a minimum of 6 characters';
  }

  if (!values.email) {
    errors.email = 'This field is required';
  } else if (!values.email.match(validationPatterns.email)) {
    errors.email = 'This email is not valid';
  }

  return errors;
}

class RegisterTwo extends React.Component {
  render() {
    let {
      fields: {name, email, password},
      handleSubmit
    } = this.props;

    return (
      <View style={{flex:1}}>
        <StatusBar backgroundColor="#2699d3" animated={true} barStyle="light-content" />
        <View style={ baseStyles.content }>
          <PageTitle
            title=""
            style={{backgroundColor: baseColor}}
            onLeftButton={() => this.props.navigator.pop()}
            iconLeft="close" />

          <LinearGradient colors={['#2699d3', '#33a0d6', '#28a0dc']} style={ [baseStyles.linearGradient, baseStyles.content] }>
            <View style={ [{padding: 0,marginLeft:0}] }>
              <View style={ [styles.pageTitle, {marginTop: 16}] }>
                <Text style={ [baseStyles.text, styles.pageTitleText, {fontSize: 18, fontWeight: '400'}] }>
                  Create Your Account
                </Text>
                <Text style={ [baseStyles.text, styles.pageSubtitleText, {marginTop: 24,fontSize:13, fontWeight: '400'}] }>
                  Your account will keep track of your progress
                </Text>
              </View>

              <View style={{
                paddingLeft: 26,
                paddingRight: 26,
                alignSelf: 'stretch',
                marginTop: 32}}
                >

                <TextInput
                  style={{height:40, color: 'white',fontSize:15}}
                  autoCapitalize="words"
                  placeholder="Full Name"
                  {...name} />

                <TextInput
                  style={{height:40, color: 'white',fontSize:15}}
                  placeholder="Email"
                  keyboardType="email-address"
                  {...email} />

                <TextInput
                  style={{height:40, color: 'white',fontSize:15}}
                  placeholder="Password"
                  secureTextEntry={ true }
                  onSubmitEditing={ handleSubmit(this.props._onSubmit) }
                  {...password} />

                <TouchableOpacity
                  onPress={ handleSubmit(this.props._onSubmit) }
                  style={ [baseStyles.submitButton, {
                    marginTop: 20,
                    height: 36,
                    flex: 1}] }>
                  <Text style={ [baseStyles.submitButtonText,{
                    fontWeight: '400', fontSize: 16}] }>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

    );
  }
}

export default reduxForm({
  form: 'registerFormStepTwo',
  fields,
  validate
})(RegisterTwo);
