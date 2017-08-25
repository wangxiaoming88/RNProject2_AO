import {StyleSheet, Platform} from 'react-native';

export const baseColor = '#2497d0';

export const navigationStyles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    height: (Platform.OS === "android") ? 60 : 50,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },

  navigationItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderStyle: 'solid',
    borderTopColor: 'transparent'
  },

  navigationItemActive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderStyle: 'solid',
    borderTopColor: baseColor
  },

  navigationItemTextActive: {
    color: baseColor
  }
})
