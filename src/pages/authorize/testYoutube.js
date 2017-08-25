import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  InteractionManager,
  StatusBar,
  Platform,


  WebView,
  Alert,
  Linking,
  ImagePicker,
} from 'react-native';
var Mixpanel = require('react-native-mixpanel');

import {baseStyles} from '../../components/styles';
import styles from './styles';

// import LinearGradient from 'react-native-linear-gradient';
// import {Video} from 'react-native-media-kit';
// var YouTube = require('react-native-youtube');
// import YouTube from 'react-native-youtube';

class TestYoutube extends React.Component {
  constructor() {
    super();

    this.state = {
      wave0: new Animated.Value(0),
      wave1: new Animated.Value(0),
      wave2: new Animated.Value(0),
      wave3: new Animated.Value(0),
      wave4: new Animated.Value(0),
      wave5: new Animated.Value(0),
      wave6: new Animated.Value(0),
      wave7: new Animated.Value(0),
      wave8: new Animated.Value(0),



      isReady: false,
      status: null,
      quality: null,
      error: null,
      isPlaying: false,

      youtube_user: {
        device_code: '',
        expires_in: 0,
        interval: '',
        user_code: '',
      },
      youtube_access: {
        access_token: '',
        expires_in: 0,
        token_type: '',
        refresh_token: '',
      },


      identityID: '#test1',
    };
  }

  componentDidMount() {
    // Init Mixpanel SDK with your project token
    Mixpanel.sharedInstanceWithToken('c38ea3c0745e97c08af205f3dd4f4419');
    // Mixpanel.identify(this.state.identityID);
    // Mixpanel.createAlias(this.state.identityID);
  }


  openBrowser(link) {
    Linking.canOpenURL(link)
    .then(supported => {
      if (!supported) {
        Alert.alert(`Can't handle url: ${link}`);
      } else {
        Linking.openURL(link);
      }
    }).catch(err => Alert.alert('An unexpected error happened', err));
  }


  async auth() {
    const API = 'https://accounts.google.com/o/oauth2/device/code';
    const CLIENT_ID = '1054321693219-t0m6vemb6m7ooicrlt205td3c6o42d5d.apps.googleusercontent.com';
    const SCOPE = 'https://www.googleapis.com/auth/youtube.upload';

    try {
      let response = await fetch(`${API}?client_id=${CLIENT_ID}&scope=${SCOPE}`, {
        method: 'POST',
        // headers: headers,
      });
      let responseJson = false;

      try {
        responseJson = await response.json();
      } catch (error) {
        return false;
      }
      return responseJson;
    } catch (error) {
      console.log(error);
    }
  }

  async serverAuth() {
    const API = 'https://accounts.google.com/o/oauth2/token';
    const CLIENT_ID = '1054321693219-t0m6vemb6m7ooicrlt205td3c6o42d5d.apps.googleusercontent.com';
    const CLIENT_SECRET = '9W35uzC3Jcfmy7FcYNfZBUg_';
    const CODE = this.state.youtube_user.device_code;
    const GRANT_TYPE = 'http://oauth.net/grant_type/device/1.0';

    let data = new FormData();
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('code', CODE);
    data.append('grant_type', GRANT_TYPE);
    console.warn(data)
    try {
      // let response = await fetch(`${API}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${CODE}&grant_type=${GRANT_TYPE}`, {
      let response = await fetch(`${API}`, {
        method: 'POST',
        // headers: headers,

        body: data,
      });
      let responseJson = false;

      try {
        responseJson = await response.json();
      } catch (error) {
        return false;
      }
      return responseJson;
    } catch (error) {
      console.log(error);
    }
  }

  youtubeAuth = () => {
    this.auth()
    .then((resp) => {
      console.warn('YOUTUBE_AUTH ', resp);
      let user = this.state.youtube_user;
      user.device_code = resp.device_code;
      user.expires_in = resp.expires_in;
      user.interval = resp.interval;
      user.user_code = resp.user_code;

      this.setState({ youtube_user: user });
      this.openBrowser(resp.verification_url);
    });
  }

  youtubeServer = () => {
    this.serverAuth()
    .then((resp) => {
      console.warn('SERVER_YOUTUBE_AUTH ', resp);
      let access = this.state.access_token;
      access.access_token = resp.access_token;
      access.expires_in = resp.expires_in;
      access.token_type = resp.token_type;
      access.refresh_token = resp.refresh_token;

      this.setState({ youtube_user: access });
    });

    Mixpanel.identify(this.state.identityID);
    Mixpanel.track("Track me please");

    // Mixpanel.set({
    //   "$email": "jsmith@example.com",    // only special properties need the $
    
    //   "$created": "2011-03-16 16:53:54",
    //   "$last_login": new Date(),         // properties can be dates...
      
    //   "credits": 150,                    // ...or numbers
      
    //   "gender": "Male"       
    // });
  }

  chooseVideo(onSuccess) {
    const options = {
      title: null,
      takePhotoButtonTitle: 'Take Video',
      chooseFromLibraryButtonTitle: 'Choose from Library',
      cancelButtonTitle: 'Cancel',
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      mediaType: 'video',
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // You can display the image using either:
        const source = {
          uri: `data:image/jpeg;base64,${response.data}`,
          isStatic: true,
        };
        // Or:
        // if (Platform.OS === 'android') {
        //   source = {uri: response.uri, isStatic: true};
        // } else {
        //   source = {uri: response.uri.replace('file://', ''), isStatic: true};
        // }
        onSuccess(source);
      }
    });
  }

  trackButton = () => {
    // Mixpanel.identity(this.state.identityID);
    // Mixpanel.trackWithProperties('Click Button', {button_type: 'yellow button', button_text: 'magic button'});
    Mixpanel.identify(this.state.identityID);
    Mixpanel.track("Submit here");
    // Mixpanel.track("Event name");
  }

  render() {
    return (
      <View style={ [baseStyles.linearGradient, {backgroundColor: '#33a0d6'}] }>
        <StatusBar backgroundColor="#2699d3" animated={true} barStyle="light-content" />
        <View style={ [styles.logoSection, {marginTop: 40}] }>
          <Text style={{fontSize: 25}}>CODE: {this.state.youtube_user.user_code}</Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {

              // <View style={ styles.logo }>
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave0}] } />
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave1}] } />
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave2}] } />
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave3}] } />
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave4}] } />
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave5}] } />
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave6}] } />
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave7}] } />
                // <Animated.View style={ [styles.logoWave, {height: this.state.wave8}] } />
              // </View>
            // <YouTube
            //   ref="youtubePlayer"
            //   videoId="-mRVK8-XfEU" // The YouTube video ID
            //   play={true}           // control playback of video with true/false
            //   hidden={false}        // control visiblity of the entire view
            //   playsInline={true}    // control whether the video should play inline
            //   loop={false}          // control whether the video should loop when ended

            //   onReady={(e)=>{this.setState({isReady: true})}}
            //   onChangeState={(e)=>{this.setState({status: e.state})}}
            //   onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
            //   onError={(e)=>{this.setState({error: e.error})}}
            //   onProgress={(e)=>{this.setState({currentTime: e.currentTime, duration: e.duration})}}

            //   style={{alignSelf: 'stretch', height: 300, backgroundColor: 'black', marginVertical: 10}}
            // />
            }
            <WebView
              style={{width: 320, height: 240, backgroundColor: 'transparent'}}
              javaScriptEnabled={true}
              // source={{uri: 'https://www.youtube.com/embed/-mRVK8-XfEU?rel=0&autoplay=1&showinfo=0&controls=1'}}
              // html={''}
              scrollEnabled={false}
              source={{html: '<html><body><iframe width="320" height="240" src="https://www.youtube.com/embed/-mRVK8-XfEU?autoplay=1" frameborder="0" allowfullscreen></iframe></body></html>'}}
            />
          </View>

          <View style={ styles.form }>
            <TouchableOpacity
              style={ [baseStyles.submitButton, {height: (Platform.OS  === 'android') ? 40 : 35, marginBottom: (Platform.OS  === 'android') ? 15 : 10, marginTop: 20}] }
              onPress={this.youtubeAuth}>
              <Text style={ [baseStyles.submitButtonText, {fontWeight: (Platform.OS  === 'android') ? 'bold' : '400', fontSize: (Platform.OS  === 'android') ? 17 : 16}] }>YouTube authorize</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ [baseStyles.submitButton, {height: (Platform.OS  === 'android') ? 40 : 35, marginBottom: 20, backgroundColor: 'rgba(0,0,0,0)'}, baseStyles.submitButtonSecondary] }
              onPress={this.youtubeServer}>
              <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, {fontWeight: (Platform.OS  === 'android') ? 'bold' : '400', fontSize: (Platform.OS  === 'android') ? 17 : 16}] }>
                Get access_token
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ [baseStyles.submitButton, {height: (Platform.OS  === 'android') ? 40 : 35, marginBottom: 20, backgroundColor: 'rgba(0,0,0,0)'}, baseStyles.submitButtonSecondary] }
              onPress={this.trackButton}>
              <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, {fontWeight: (Platform.OS  === 'android') ? 'bold' : '400', fontSize: (Platform.OS  === 'android') ? 17 : 16}] }>
                upload video
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default TestYoutube;

  

// I just set up mixpanel with this package: https://github.com/davodesign84/react-native-mixpanel

// And then I have something like this in my main.js file that holds all my view components:

// componentWillMount: function() {
//     this.loadData(this.setDataState);
//     // not sure if this is the best way to do it, but whatever
//     Mixpanel.identify(DeviceInfo.getUniqueID());
//     Mixpanel.set("$name", DeviceInfo.getDeviceName());
//     Mixpanel.track("App Loaded");
// }

// And then in my view.js that renders a component with data, I have something like this:

// componentWillMount: function() {
//     Mixpanel.trackWithProperties("Definition Viewed",{word:this.state.word});

// }

// And then I also call mixpanel when a users adds/deletes data.

// After all this, I just noticed that fabric does analytics so I will probably migrate to that because I use to to manage beta testers and its awesome so it'll be nice to have everything in 1 place

