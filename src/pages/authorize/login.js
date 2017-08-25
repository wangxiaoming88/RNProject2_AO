import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  InteractionManager,
  Modal,
  StatusBar,
  Dimensions,
  Platform,
  NativeModules,
} from 'react-native';

import {baseStyles, baseColor} from '../../components/styles';
import styles from './styles';

import TextInput from '../../components/common/form/textInput';
import {reduxForm} from 'redux-form';

import {GoogleSignin} from 'react-native-google-signin';
import GoogleSigninSettings from '../../services/googleLoginSettings';

var {FBLoginManager} = require('react-native-facebook-login');

import PageTitle from '../../components/common/pageTitle';

import Icon from 'react-native-vector-icons/Entypo';
import validationPatterns from '../../services/validationPatterns';

import LinearGradient from 'react-native-linear-gradient';
var height = Dimensions.get('window').height;

import {
  login,
  loginWithFB,
  loginWithGoogle,
  registerWithFB,
  registerWithGoogle,
} from '../../redux/actions/user';

import ForgotPasswordModal from '../../components/login/forgotPasswordModal';

let fields = ['email', 'password'];
function validate(values) {
  let errors = {};

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

class LoginPage extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsVisible: false
    };
  }

  componentDidMount() {
    GoogleSignin.configure(GoogleSigninSettings);
    // FBLoginManager.LoginBehaviors = {
    //   SystemAccount:"DEVICE_AUTH",
    //   NativeOnly:"NATIVE_ONLY",
    //   Native:"NATIVE_WITH_FALLBACK", // android default
    //   Web:"WEB_ONLY"
    // }
  }

  _onSubmit(data) {
    this.props.dispatch(login(data, () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.navigator.resetTo({id: 'main', nologin: true});
      });
    }));
  }

  _googleSignIn() {
    // console.warn('google sign in from login');
    // GoogleSignin.signIn()
    // .then((user) => {
    //   // console.warn('user google: ', user);
    //   this.props.dispatch(registerWithGoogle(user), () => {
    //     InteractionManager.runAfterInteractions(() => {
    //       this.props.navigator.resetTo({id: 'main', nologin: true});
    //     });
    //   });
    // })
    // .catch((err) => {
    //   console.log(err.name, err);
    //   Alert.alert('Google authentication error', err.name);
    // });
  }

  _facebookSignIn() {
    console.warn('from login');
    FBLoginManager.loginWithPermissions(['email', 'public_profile'], (error, resp) => {
      if (!error) {
        this.props.dispatch(registerWithFB(resp, () => {
          setTimeout(() => {
            this.props.navigator.resetTo({id: 'main', nologin: true});
          }, 10);
        }));
      } else {
        Alert.alert('Facebook authentication error', 'Unhandled error.');
        console.log(error);
      }
    });
  }

  _setModalVisible(visible) {
    this.setState({modalIsVisible: visible});
  }

  render() {
    let {
      fields: {email, password},
      handleSubmit
    } = this.props;

    const viewStyle1 = (Platform.OS === 'ios') ?
      { flex: 0.6 }
      :
      [baseStyles.centeredContainer, { flex: 0.6 }];

    const textInputStyle = {
      style: {
        height:40, color: 'white',fontSize:15,
      }
    };

    return (
      <View>
        <StatusBar backgroundColor="#2699d3" animated={true} barStyle="light-content" />
        <View style={ {height: (Platform.OS === 'android') ?
          height - 20 : height} }>
          <PageTitle
            title=""
            style={{backgroundColor: baseColor}}
            onLeftButton={() => this.props.navigator.pop()}
            iconLeft="chevron-left" />

          <LinearGradient colors={['#2699d3', '#33a0d6', '#28a0dc']} style={ [baseStyles.linearGradient, {flex:1}] }>
            <View style={viewStyle1}>
              <View style={ styles.pageTitle }>
                <Text style={ [baseStyles.text, styles.pageTitleText, {
                  fontSize: (Platform.OS === 'ios') ? 18 : 20,
                  fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
                }] }>Enter Your Details</Text>
              </View>

              <View style={ {
                alignSelf: 'stretch',
                paddingLeft: 26,
                paddingRight: 26,
                marginTop: 36
              } }>
                <TextInput
                  placeholder="E-mail"
                  keyboardType="email-address"
                  {...textInputStyle}
                  {...email} />

                <TextInput
                  placeholder="Password"
                  secureTextEntry={ true }
                  onSubmitEditing={ handleSubmit(this._onSubmit.bind(this)) }
                  {...textInputStyle}
                  {...password} />

                <TouchableOpacity
                  style={ [baseStyles.submitButton, {
                    height: (Platform.OS === 'ios') ? 35 : 44,
                    marginBottom: 10,
                    marginTop: 30,
                  }] }
                  onPress={ handleSubmit(this._onSubmit.bind(this)) }>
                  <Text style={ [baseStyles.textThinPlatform,baseStyles.submitButtonText, {
                      fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
                      fontSize: 16,
                    }] }>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style= {[baseStyles.submitButton, {height: (Platform.OS === 'ios') ? 35 : 44,marginTop: 0, backgroundColor: 'rgba(0,0,0,0)'}]}
                  onPress={ this._setModalVisible.bind(this, true) }>
                  <Text style={[baseStyles.textThinPlatform,baseStyles.link, {
                    textAlign: 'center',
                    fontSize: (Platform.OS === 'ios') ? 16 : 18,
                    fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
                  }]}>Forget password</Text>
                </TouchableOpacity>

                <Modal
                  transparent={ true }
                  visible={ this.state.modalIsVisible }
                  onRequestClose={ this._setModalVisible.bind(this, false) }>
                    <ForgotPasswordModal onClose={ this._setModalVisible.bind(this, false) } />
                </Modal>
              </View>
            </View>

            <View style={ [styles.form, {marginBottom: 30 }] }>
              <Text style={ [baseStyles.textThinPlatform,baseStyles.text, {
                alignSelf: 'stretch',
                textAlign: 'center',
                marginBottom: 20,
                fontSize: 13,
                fontWeight: (Platform.OS === 'ios') ? '200' : '400',
              }] }>
                One-tap Sign In
              </Text>
              <View style={ [baseStyles.twoInputWrapper, {
                alignItems: 'center'
              }] }>
              <TouchableOpacity
                  style={ [baseStyles.submitButton, styles.facebookButton, styles.touchableButton]}
                  onPress={ this._facebookSignIn.bind(this) }>
                  <Icon
                    style={{}}
                    name="facebook-with-circle" size={ (Platform.OS === 'ios') ? 25 : 30 } color="white" />
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, styles.touchableText] }>Facebook</Text>
                </TouchableOpacity>

                <View style={ {width: (Platform.OS === 'ios') ? 15 : 20} } />

                <TouchableOpacity
                  style={ [baseStyles.submitButton, styles.googleButton, styles.touchableButton]}
                  onPress={ this._googleSignIn.bind(this) }>
                  <Icon
                    style={{}}
                    name="google--with-circle" size={ (Platform.OS === 'ios') ? 25 : 30 } color="white" />
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, styles.touchableText] }>Google</Text>
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
  form: 'loginForm',
  fields,
  validate
})(LoginPage);
