import {StyleSheet, Platform} from 'react-native';
import {fontAndroidThin,fontAndroidLight,fontIOSThin,fontIOSLight} from '../../components/fonts.js';

var fontThin = function() {
  return (Platform.OS === 'android') ? fontAndroidThin : fontIOSThin;
};

var fontLight = function() {
  return (Platform.OS === 'android') ? fontAndroidLight : fontIOSLight;
};

let styles = StyleSheet.create({
  pageTitle: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pageTitleText: {
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily:  fontThin(),
    fontWeight: (Platform.OS === 'android') ? 'bold' : '400',
  },
  pageSubtitleText: {
    fontSize: 17,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: fontLight(),
  },
  logoSection: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 185,
    width: 185,
    borderRadius: 180,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'white',
    paddingLeft: 26,
    paddingRight: 18,
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoWave: {
    width: 7,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 6,
    margin: 3
  },
  form: {
    flex: 0.3,
    padding: 5,
    paddingLeft: 26,
    paddingRight: 26,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  bottomNote: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  facebookButton: {
    backgroundColor: '#3b5998'
  },
  buttonIcon: {
    position: 'absolute',
    left: 12,
    top: (Platform.OS === "android") ? 6 : 7
  },
  googleButton: {
    backgroundColor: '#ef6860'
  },
  bottomButtons: {
    flex: 0.1,
    padding: 15,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  separator: {
    width: 0.5,
    height: 38,
    backgroundColor: 'white'
  },
  touchableText: {
    marginLeft: 8,
    marginRight: 8,
    fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
    marginBottom: 3,
    fontSize: (Platform.OS === 'ios') ? 16 : 18,
  },
  touchableButton: {
    flex: 0.5,
    height: (Platform.OS === 'ios') ? 38 : 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
