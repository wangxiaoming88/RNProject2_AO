import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';

import {baseStyles, baseColor} from '../../components/styles';
import styles from '../../pages/authorize/styles';

import TextInput from '../../components/common/form/textInput';
import {reduxForm} from 'redux-form';

import PageTitle from '../../components/common/pageTitle';

import validationPatterns from '../../services/validationPatterns';
import LinearGradient from 'react-native-linear-gradient';

const fontWeight = {
  fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
};

const constStyle = StyleSheet.create({
  inputContainer: {
    paddingLeft: 26,
    paddingRight: 26,
    alignSelf: 'stretch',
    marginTop: 32,
  },
  topContainer: {
    marginTop: 16,
    backgroundColor: 'transparent',
  },
  submitTouchable: {
    marginTop: 20,
    height: 36,
    flex: 1,
  },
  createText: {
    ...fontWeight,
    fontSize: (Platform.OS === 'ios') ? 16 : 18,
  },
  h1: {
    ...fontWeight,
    fontSize: (Platform.OS === 'ios') ? 18 : 20,
  },
  h2: {
    ...fontWeight,
    marginTop: 24,
    fontSize: (Platform.OS === 'ios') ? 13 : 15,
  },
});

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

    const textInputStyle = {
      style: {
        height:40, color: 'white',fontSize:15,
      }
    };

    return (
      <View>
        <StatusBar backgroundColor="#2699d3" animated={true} barStyle="light-content" />
        <View style={baseStyles.content}>
          <PageTitle
            title=""
            style={{backgroundColor: baseColor}}
            onLeftButton={() => this.props.navigator.pop()}
            iconLeft="close" />

          <LinearGradient colors={['#2699d3', '#33a0d6', '#28a0dc']} style={[baseStyles.linearGradient, baseStyles.content]}>
            <View>
              <View style={[styles.pageTitle, constStyle.topContainer]}>
                <Text style={[baseStyles.text, styles.pageTitleText, constStyle.h1] }>
                  Create Your Account
                </Text>
                <Text style={[baseStyles.text, styles.pageSubtitleText, constStyle.h2] }>
                  Your account will keep track of your progress
                </Text>
              </View>

              <View style={constStyle.inputContainer}>
                <TextInput
                  {...textInputStyle}
                  autoCapitalize="words"
                  placeholder="Full Name"
                  {...name}
                />
                <TextInput
                  {...textInputStyle}
                  placeholder="Email"
                  keyboardType="email-address"
                  {...email}
                />
                <TextInput
                  {...textInputStyle}
                  placeholder="Password"
                  secureTextEntry={ true }
                  onSubmitEditing={ handleSubmit(this.props._onSubmit) }
                  {...password}
                />
                <TouchableOpacity
                  onPress={ handleSubmit(this.props._onSubmit) }
                  style={[baseStyles.submitButton, constStyle.submitTouchable]}>
                  <Text style={[baseStyles.submitButtonText, constStyle.createText]}>Create Account</Text>
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
