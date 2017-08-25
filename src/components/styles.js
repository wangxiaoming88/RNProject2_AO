import {StyleSheet, Platform} from 'react-native';

export const baseColor   = '#2699d3';
export const secondColor = '#2497d0';

import {fontAndroidThin,fontAndroidLight,fontIOSThin,fontIOSLight} from './fonts.js';

var fontThin = function() {
  return (Platform.OS === 'android') ? fontAndroidThin : fontIOSThin;
};

var fontLight = function() {
  return (Platform.OS === 'android') ? fontAndroidLight : fontIOSLight;
};

export const baseStyles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: baseColor,
  },
  text: {
    fontSize: 14,
    color: 'white',
    fontFamily: fontLight(),
  },
  content: {
    flex: 1,
    padding: 0
  },
  contentL: {
    backgroundColor: '#efeff4',
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  blockTitle: {
    paddingVertical: 10,
    // paddingTop: 30,
    paddingTop: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  blockTitleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: (Platform.OS === 'android') ? 'bold' : '400'
  },
  blockTitleTextL: {
    color: 'gray'
  },
  link: {
    color: 'white'
  },
  linkL: {
    color: baseColor
  },
  submitButton: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  submitButtonText: {
    fontFamily: fontThin(),
    color: baseColor,
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'center',
  },
  submitButtonSecondary: {
    backgroundColor: baseColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'white',
  },
  loginupButton: {
    fontSize: 17,
    fontWeight: (Platform.OS === 'android') ? 'bold' : '400',
    fontFamily: fontLight(),
  },
  submitButtonSecondaryText: {
    color: 'white'
  },
  twoInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch'
  },
  twoInputWrapperItem: {
    flex:1,
    alignSelf: 'stretch'
  },

  textThinPlatform: {
    fontFamily: fontThin()
  },

  textLightPlatform: {
    fontFamily: fontLight()
  },

  modal: {
    backgroundColor: 'white',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 4,
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0
  },
  buttonWithIcon: {
    flexDirection: 'row',
    alignItems: 'center'
  },
});
