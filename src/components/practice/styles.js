import {StyleSheet} from 'react-native';

export const practiceStyles = StyleSheet.create({
  item: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20
  },
  itemName: {
    color: '#333'
  },
  progressText: {
    color: '#999',
  },
  progressBar: {
    height: 5,
    marginBottom: 1
  }
})
