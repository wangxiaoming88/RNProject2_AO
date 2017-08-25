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
  AsyncStorage
} from 'react-native';

import {baseStyles, baseColor} from '../../components/styles';
import styles from './styles';

import TextInput from '../../components/common/form/textInput';
import {reduxForm} from 'redux-form';

import {GoogleSignin} from 'react-native-google-signin';
import GoogleSigninSettings from '../../services/googleLoginSettings';

import {FBLoginManager} from 'NativeModules';

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
  }

  _onSubmit(data) {
    this.props.dispatch(login(data, () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.navigator.resetTo({id: 'main'});
      });
    }));
  }

  _googleSignIn() {
   // console.warn('google sign in 123');
    // GoogleSignin.signIn()
    // .then((user) => {
    //   // this.props.dispatch(loginWithGoogle(user), () => {
    //   //   InteractionManager.runAfterInteractions(() => {
    //   //     this.props.navigator.resetTo({id: 'main'});
    //   //   });
    //   // });
    //   console.log(user);
    // })
    // .catch((err) => {
    //   console.log(err.name, err.code);
    //   Alert.alert('Google authentication error', err.name);
    // });
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
  }

  _setModalVisible(visible) {
    this.setState({modalIsVisible: visible});
  }

  render() {
    let {
      fields: {email, password},
      handleSubmit
    } = this.props;

    return (
      <View style={ {} }>
        <StatusBar backgroundColor="#2699d3" animated={true} barStyle="light-content" />
        <View style={ {height: (Platform.OS === 'android') ?
          height - 20 : height} }>
          <PageTitle
            title=""
            style={{backgroundColor: baseColor}}
            onLeftButton={() => this.props.navigator.pop()}
            iconLeft="chevron-left" />

          <LinearGradient colors={['#2699d3', '#33a0d6', '#28a0dc']} style={ [baseStyles.linearGradient, {flex:1}] }>
            <View style={ [{flex: 0.6}] }>
              <View style={ styles.pageTitle }>
                <Text style={ [baseStyles.text, styles.pageTitleText, {fontSize: 18,fontWeight: '400'}] }>Enter Your Details</Text>
              </View>

              <View style={ {
                alignSelf: 'stretch',
                paddingLeft: 26,
                paddingRight: 26,
                marginTop: 36
              } }>
                <TextInput
                  style={{height:40, color: 'white',fontSize:15}}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  {...email} />

                <TextInput
                 style={{height:40, color: 'white',fontSize:15}}
                  placeholder="Password"
                  secureTextEntry={ true }
                  onSubmitEditing={ handleSubmit(this._onSubmit.bind(this)) }
                  {...password} />

                <TouchableOpacity
                  style={ [baseStyles.submitButton, {height: 35,marginBottom: 10, marginTop: 30}] }
                  onPress={ handleSubmit(this._onSubmit.bind(this)) }>
                  <Text style={ [baseStyles.textThinPlatform,baseStyles.submitButtonText, {
                      fontWeight: '400', fontSize: 16
                    }] }>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style= {[baseStyles.submitButton, {height: 35,marginTop: 0, backgroundColor: 'rgba(0,0,0,0)'}]}
                  onPress={ this._setModalVisible.bind(this, true) }>
                  <Text style={[baseStyles.textThinPlatform,baseStyles.link, {textAlign: 'center', fontSize: 16, fontWeight: '400'}]}>Forget password</Text>
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
                fontWeight: '200'
              }] }>
                One-tap Sign In
              </Text>
              <View style={ [baseStyles.twoInputWrapper, {
                alignItems: 'center'
              }] }>
              <TouchableOpacity
                  style={ [baseStyles.submitButton, styles.facebookButton, {
                    flex: 0.5,
                    height: 40,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'}
                  ]}
                  onPress={ this._facebookSignIn.bind(this) }>
                  <Icon
                    style={{}}
                    name="facebook-with-circle" size={ 25 } color="white" />
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, {marginLeft: 8,marginRight: 8, fontWeight: '400', marginBottom: 3,fontSize: 16}] }>Facebook</Text>
                </TouchableOpacity>

                <View style={ {width: 15} } />

                <TouchableOpacity
                  style={ [baseStyles.submitButton, styles.googleButton, {
                    flex: 0.5,
                    height: 40,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'}
                  ]}
                  onPress={ this._googleSignIn.bind(this) }>
                  <Icon
                    style={{}}
                    name="google--with-circle" size={ 25 } color="white" />
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, {marginLeft: 8,marginRight: 8, fontWeight: '400', marginBottom: 3, fontSize: 16}] }>Google</Text>
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
