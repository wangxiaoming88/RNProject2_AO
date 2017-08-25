import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Navigator,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';

import {baseStyles, baseColor} from '../../components/styles';
import styles from '../../pages/authorize/styles';

import PageTitle from '../../components/common/pageTitle';

import {FBLoginManager} from 'NativeModules';
import GoogleSigninSettings from '../../services/googleLoginSettings';
import {GoogleSignin} from 'react-native-google-signin';

import Icon from 'react-native-vector-icons/Entypo';

var height = Dimensions.get('window').height;
import LinearGradient from 'react-native-linear-gradient';

class RegisterOne extends React.Component {
  componentDidMount() {
    GoogleSignin.configure(GoogleSigninSettings);
  }

  _googleSignIn() {
    //console.warn('google sign in');
    // GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
    // // play services are available. can now configure library
    //   // GoogleSignin.signIn()
    //   // .then((user) => {
    //   //   // this.props.onGoogleLogin(user);
    //   //   console.warn('user: ', user)
    //   // })
    //   // .catch((err) => {
    //   //   console.log('google.error', err.name + err.code);
    //   //   Alert.alert('Google authentication error', err.name);
    //   // });
    //   GoogleSignin.currentUserAsync()
    //   .then((token) => {
    //     Alert.alert('google: ', token);
    //   })
    //   .catch((err) => {
    //     Alert.alert('google: ', err);
    //   })
    //   .done();
    //   // Alert.alert('okay');
    // })
    // .catch((err) => {
    //   console.log('google.error', err.code, err.message);
    //   Alert.alert('Google Play Service error', err.name);
    // });
  }

  _facebookSignIn() {
    FBLoginManager.loginWithPermissions(['email'], (error, resp) => {
      if (!error) {
        this.props.onFacebookLogin(resp);
      } else {
        Alert.alert('Facebook authentication error', 'Unhandled error.');
        console.log(error);
      }
    });
  }


  render() {
    return (
      <View style={{}}>
        <StatusBar backgroundColor="#2699d3" animated={true} barStyle="light-content" />
        <View style={{height: height}} >
          <PageTitle
            title=""
            style={{backgroundColor: baseColor}}
            onLeftButton={() => this.props.navigator.pop()}
            iconLeft="close" />

          <LinearGradient colors={['#2699d3', '#33a0d6', '#28a0dc']} style={ [baseStyles.linearGradient, {}] }>
            <View style={ [baseStyles.centeredContainer, {flex: 0.4} ] }>
              <View style={ [styles.pageTitle, {backgroundColor: 'rgba(0,0,0,0)'}] }>
                <Text style={ [baseStyles.text, styles.pageTitleText, {fontSize: 21,}] }>
                  Get Started
                </Text>
                <Text style={ [baseStyles.text, styles.pageSubtitleText, {fontSize: 16,marginTop: 20}] }>
                  You'll be ready to go in seconds
                </Text>
              </View>
              <View style={ {
                marginTop: 30,
                paddingLeft: 26,
                paddingRight: 26,
                alignSelf: 'stretch',
                justifyContent: 'center'
              }}>

                <TouchableOpacity
                  style={[styles.facebookButton,{
                    flexDirection: 'row',
                    borderRadius: 5,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 44,
                    marginBottom: 15,
                  }]}
                  onPress={ this._facebookSignIn.bind(this) }
                  >
                  <Icon
                    style={styles.buttonIcon}
                    name="facebook-with-circle" size={ 30 } color="white" />
                  <Text style={[baseStyles.submitButtonText,baseStyles.submitButtonSecondaryText,{fontWeight: 'bold'}]}>Login with Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={ [styles.googleButton, {
                    flexDirection: 'row',
                    borderRadius: 5,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 44,}] }
                  onPress={ this._googleSignIn.bind(this) }
                  >
                  <Icon
                    style={ styles.buttonIcon }
                    name="google--with-circle" size={ 30 } color="white" />
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, {fontWeight: 'bold'}] }>Login with Google</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={ [styles.form, {backgroundColor: 'rgba(0,0,0,0)'}] }>
              <Text style={ [baseStyles.text, baseStyles.textThinPlatform, {
                alignSelf: 'stretch',
                textAlign: 'center',
                marginBottom: 20,
                fontSize: 13,
              }] }>
                Or continue with e-mail
              </Text>
              <View style={ [baseStyles.twoInputWrapper, {
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 42
              }] }>
                <TouchableOpacity
                  style={ [styles.bottomButtons, {}] }
                  onPress={ () => this.props.navigator.push({
                  id: 'login',
                  unauthorized: true,
                  sceneConfigs: Navigator.SceneConfigs.FadeAndroid
                }) }>
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, baseStyles.loginupButton] }>Log In</Text>
                </TouchableOpacity>

                <View style={ styles.separator } />

                <TouchableOpacity
                  style={ [styles.bottomButtons, {}] }
                  onPress={ this.props._onSubmit }
                  >
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, baseStyles.loginupButton] }>Sign Up</Text>
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
