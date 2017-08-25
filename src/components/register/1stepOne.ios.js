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
    // GoogleSignin.signIn()
    // .then((user) => {
    //   this.props.onGoogleLogin(user);
    // })
    // .catch((err) => {
    //   console.log(err.name, err.code);
    //   Alert.alert('Google authentication error', err.name);
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
                <Text style={ [baseStyles.text, styles.pageTitleText, {fontSize: 19,fontWeight: '400'}] }>
                  Get Started
                </Text>
                <Text style={ [baseStyles.text, styles.pageSubtitleText, {fontSize: 15,marginTop: 20,fontWeight: '400'}] }>
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
                    height: 40,
                    marginBottom: 15,
                  }]}
                  onPress={ this._facebookSignIn.bind(this) }
                  >
                  <Icon
                    style={styles.buttonIcon}
                    name="facebook-with-circle" size={ 25 } color="white" />
                  <Text style={[baseStyles.submitButtonText,baseStyles.submitButtonSecondaryText,{fontWeight: '400', fontSize: 15}]}>Login with Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={ [styles.googleButton, {
                    flexDirection: 'row',
                    borderRadius: 5,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,}] }
                  onPress={ this._googleSignIn.bind(this) }
                  >
                  <Icon
                    style={ styles.buttonIcon }
                    name="google--with-circle" size={ 25 } color="white" />
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, {fontWeight: '400',fontSize: 15}] }>Login with Google</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={ [styles.form, {backgroundColor: 'rgba(0,0,0,0)'}] }>
              <Text style={ [baseStyles.text, baseStyles.textThinPlatform, {
                alignSelf: 'stretch',
                textAlign: 'center',
                marginBottom: 20,
                fontSize: 12,
                fontWeight: '200'
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
                  //sceneConfigs: Navigator.SceneConfigs.FadeAndroid
                }) }>
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, baseStyles.loginupButton, {fontSize: 16,fontWeight: '400'}] }>Log In</Text>
                </TouchableOpacity>

                <View style={ styles.separator } />

                <TouchableOpacity
                  style={ [styles.bottomButtons, {}] }
                  onPress={ this.props._onSubmit }
                  >
                  <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, baseStyles.loginupButton, {fontSize: 16,fontWeight: '400'}] }>Sign Up</Text>
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
