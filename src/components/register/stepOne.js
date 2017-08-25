import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Platform,
  Navigator,
  StyleSheet,
} from 'react-native';

import {baseStyles, baseColor} from '../../components/styles';
import styles from '../../pages/authorize/styles';

import PageTitle from '../../components/common/pageTitle';
import GoogleSigninSettings from '../../services/googleLoginSettings';
import {GoogleSignin} from 'react-native-google-signin';

var {FBLoginManager} = require('react-native-facebook-login');

import Icon from 'react-native-vector-icons/Entypo';

var height = Dimensions.get('window').height;
import LinearGradient from 'react-native-linear-gradient';

const constStyle = StyleSheet.create({
  textTitleText: {
    fontSize: (Platform.OS === 'ios') ? 19 : 21,
    fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
  },
  textSubtitleText: {
    fontSize: (Platform.OS === 'ios') ? 15 : 16,
    marginTop: 20,
    fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
  },
  centeredContainer: {
    flex: 0.4,
  },
  inputContainers: {
    marginTop: 30,
    paddingLeft: 26,
    paddingRight: 26,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  bigSocialButton: {
    flexDirection: 'row',
    borderRadius: 5,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: (Platform.OS === 'ios') ? 40 : 44,
  },
  facebookMarginButton: {
    marginBottom: 15,
  },
  socialText: {
    fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
    fontSize: (Platform.OS === 'ios') ? 15 : 16,
  },
  continueText: {
    alignSelf: 'stretch',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: (Platform.OS === 'ios') ? 12 : 13,
    fontWeight: '200'
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 42,
  },
  controlButtonText: {
    fontSize: (Platform.OS === 'ios') ? 16 : 17,
    fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
  },
  transparent: {
    backgroundColor: 'rgba(0,0,0,0)',
  }
});

class RegisterOne extends React.Component {
  componentDidMount() {
    GoogleSignin.configure(GoogleSigninSettings)
    .then(() => {
      // GoogleSignin.currentUserAsync().then((user) => {
      //   console.log('USER', user);
        // this.props.onGoogleLogin(user);
        // this.setState({user: user});
      // }).done();
    });
  }

  _googleSignIn() {
    console.warn('google sign in');
      GoogleSignin.signIn()
      .then((user) => {
        // console.warn('google_user', user);
        this.props.onGoogleLogin(user);
      })
      .catch((err) => {
        console.warn('WRONG SIGNIN', err);
      })
      .done();
  }

  _facebookSignIn() {
    console.log('facebokk login');
    FBLoginManager.loginWithPermissions(['public_profile', 'email'], (error, resp) => {
      if (!error) {
        console.log(resp);
        this.props.onFacebookLogin(resp);
      } else {
        Alert.alert('Facebook authentication error', 'Unhandled error.');
        console.log(error);
      }
    });
  }

  _toLogin = () => {
    const args = {
      id: 'login',
      unauthorized: true,
    };

    if (Platform.OS === 'android') {
      args.sceneConfigs = Navigator.SceneConfigs.FadeAndroid;
    }

    this.props.navigator.replace(args);
  }

  render() {
    return (
      <View>
        <StatusBar backgroundColor="#2699d3" animated={true} barStyle="light-content" />
        <View style={{height: height}} >
          <PageTitle
            title=""
            style={{backgroundColor: baseColor}}
            onLeftButton={() => this.props.navigator.pop()}
            iconLeft="close" />

          <LinearGradient colors={['#2699d3', '#33a0d6', '#28a0dc']} style={baseStyles.linearGradient}>
            <View style={[baseStyles.centeredContainer, constStyle.centeredContainer]}>
              <View style={[styles.pageTitle, constStyle.transparent]}>
                <Text style={[baseStyles.text, styles.pageTitleText, constStyle.textTitleText]}>
                  Get Started
                </Text>
                <Text style={[baseStyles.text, styles.pageSubtitleText, constStyle.textSubtitleText]}>
                  You'll be ready to go in seconds
                </Text>
              </View>
              <View style={constStyle.inputContainers}>
                <TouchableOpacity
                  style={[styles.facebookButton, constStyle.bigSocialButton, constStyle.facebookMarginButton]}
                  onPress={ this._facebookSignIn.bind(this) }
                  >
                  <Icon
                    style={styles.buttonIcon}
                    name="facebook-with-circle" size={ (Platform.OS === 'ios') ? 25 : 30 } color="white" />
                  <Text style={[baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, constStyle.socialText]}>Login with Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.googleButton, constStyle.bigSocialButton]}
                  onPress={ this._googleSignIn.bind(this) }
                  >
                  <Icon
                    style={ styles.buttonIcon }
                    name="google--with-circle" size={ (Platform.OS === 'ios') ? 25 : 30 } color="white" />
                  <Text style={[baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, constStyle.socialText]}>Login with Google</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.form, constStyle.transparent]}>
              <Text style={[baseStyles.text, baseStyles.textThinPlatform, constStyle.continueText]}>
                Or continue with e-mail
              </Text>
              <View style={[baseStyles.twoInputWrapper, constStyle.bottomContainer]}>
                <TouchableOpacity
                  style={styles.bottomButtons}
                  onPress={ this._toLogin }
                >
                  <Text style={[baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, baseStyles.loginupButton,constStyle.controlButtonText]}>Log In</Text>
                </TouchableOpacity>
                <View style={ styles.separator } />
                <TouchableOpacity
                  style={styles.bottomButtons}
                  onPress={ this.props._onSubmit }
                >
                  <Text style={[baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, baseStyles.loginupButton,constStyle.controlButtonText]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }
}

export default RegisterOne;
