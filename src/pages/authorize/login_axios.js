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
  Platform
} from 'react-native';

import {baseStyles, baseColor} from '../../components/styles';
import styles from './styles';

import TextInput from '../../components/common/form/textInput';
import {reduxForm} from 'redux-form';

import {GoogleSignin} from 'react-native-google-signin';
import GoogleSigninSettings from '../../services/googleLoginSettings';

import {FBLoginManager} from 'NativeModules';
// import curl from 'curlrequest';
import axios from 'axios';

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
  // fbMyLogin
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

    this.axiosFetch = null;
  }

  componentDidMount() {
    GoogleSignin.configure(GoogleSigninSettings);

    this.axiosFetch = axios.create({
      baseURL: 'https://adagio.co/api/',
      timeout: 1000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'transfer-encoding': 'Identity',
        'csrf_token': 'j3UXbGDl2PDpSBzkvH5QZlffT18oXX0B',
      },
    });
  }

  _onSubmit(data) {
    this.props.dispatch(login(data, () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.navigator.resetTo({id: 'main'});
      });
    }));
  }

  _googleSignIn() {
    //console.warn('google sign in');
  GoogleSignin.currentUserAsync().then((user) => {
        console.log('USER', user);
      }).done();
    // this.axiosFetch.post('auth/login/', {
    //   email: 'tester1@mail.com',
    //   password: 'tester1',
    // })
    // .then(function (response) {
    //   console.log('AXIOS: ', response);
    // })
    // .catch(function (error) {
    //   console.log('AXIOS: ', error);
    // });

    // FBLoginManager.loginWithPermissions(['email'], (error, resp) => {
    //   if (!error) {
    //     console.warn(resp);
    //     this.axiosFetch.post('auth/facebook/', {
    //       access_token: resp.credentials.token,
    //     })
    //     .then(function (response) {
    //       console.log('AXIOS: ', response);
    //     })
    //     .catch(function (error) {
    //       console.log('AXIOS: ', error);
    //     });
    //   } else {
    //     Alert.alert('Facebook authentication error', 'Unhandled error.');
    //     console.log(error);
    //   }
    // });
    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      // this.props.dispatch(loginWithGoogle(user), () => {
      //   InteractionManager.runAfterInteractions(() => {
      //     this.props.navigator.resetTo({id: 'main'});
      //   });
      // });
    })
    .catch((err) => {
      console.log(err.name, err.code);
      Alert.alert('Google authentication error', err.name);
    });
    // curl.request({ url: 'http://google.com', pretend: true }, function (err, stdout, meta) {
    //   console.log('%s %s', meta.cmd, meta.args.join(' '));
    // });

    // fetch("http://adagio.co/api/auth/facebook/", { body: "{\"access_token\": \"place_valid_access_token_here\"}", header: { "Content-Type": "application/json" }, method: "POST" })
  }

  // _facebookSignIn() {
  //   FBLoginManager.loginWithPermissions(['email'], (error, resp) => {
  //     if (!error) {
  //       this.props.dispatch(loginWithFB(resp.credentials, () => {
  //         console.warn('login ios fb: ', resp)
  //         InteractionManager.runAfterInteractions(() => {
  //           this.props.navigator.resetTo({id: 'main'});
  //         });
  //       }));
  //     } else {
  //       Alert.alert('Facebook authentication error', 'Unhandled error.');
  //       console.log(error);
  //     }
  //   });

  // }

  _facebookSignIn() {
    FBLoginManager.loginWithPermissions(['email'], (error, resp) => {
      if (!error) {
        console.warn(resp)
        this.props.dispatch(registerWithFB(resp, () => {
          setTimeout(() => {
            this.props.navigator.resetTo({id: 'main'});
          }, 10);
        }));
      } else {
        Alert.alert('Facebook authentication error', 'Unhandled error.');
        console.log(error);
      }
    });
    // FBLoginManager.loginWithPermissions(['email'], (error, resp) => {
    //   if (!error) {
    //     fbMyLogin(resp, () => {
    //       setTimeout(() => {
    //         this.props.navigator.resetTo({id: 'main'});
    //       }, 10);
    //     });
    //   } else {
    //     Alert.alert('Facebook authentication error', 'Unhandled error.');
    //     console.log(error);
    //   }
    // });

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
                  style={{height: 40, color: 'white', fontSize: 15}}
                  {...email} />

                <TextInput
                  style={{height:40, color: 'white',fontSize: 15}}
                  placeholder="Password"
                  secureTextEntry={ true }
                  onSubmitEditing={ handleSubmit(this._onSubmit.bind(this)) }
                  {...password} />

                <TouchableOpacity
                  style={ [baseStyles.submitButton, {
                    height: (Platform.OS === 'ios') ? 35 : 44,
                    marginBottom: 10,
                    marginTop: 30,
                  }] }
                  onPress={ handleSubmit(this._onSubmit.bind(this)) }>
                  <Text style={ [baseStyles.textThinPlatform,baseStyles.submitButtonText, {
                      fontWeight: '400', fontSize: 16
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
