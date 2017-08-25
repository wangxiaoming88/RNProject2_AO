import React from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const iconSize = 40;

class OptionsModal extends React.Component {
  render() {
    let { onCloseModal, onCreateEditGoal, isCreated, } = this.props;
    return (
      <View style={ styles.container }>
        <View style={ styles.modal }>
          <View style={ styles.headerGifContainer }>
            <Image
              style={ styles.headerGif }
              source={ (Platform.OS === 'ios')
                ? { uri: 'animation.gif' }
                : require('./../../../images/animation.gif')
              }
              resizeMode={ 'repeat' }
            >
              <View style={ styles.headerContainer }>
                <TouchableOpacity
                  style={ styles.headerIconContainer }
                  onPress={ onCloseModal }
                >
                  <Icon name={ 'close' } size={ 20 } color={ 'white' } />
                </TouchableOpacity>
                <Text style={ styles.headerTitle }>
                  Options
                </Text>
              </View>
            </Image>
          </View>
          <View style={[ styles.optionsList ]}>
            <TouchableOpacity onPress={ () =>  { !isCreated && onCreateEditGoal() }}>
              <Text style={[ styles.option, { color: isCreated ? 'gray' : 'black' } ]}>
                Create Goal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () =>  { isCreated && onCreateEditGoal() }}>
              <Text style={[ styles.option, { color: !isCreated ? 'gray' : 'black' } ]}>
                Edit Goal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () =>  { }}>
              <Text style={[ styles.option ]}>
                Detail
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    width: width - 30,
    // height:  height / 1.5,
    justifyContent: 'flex-start',
    //alignItems: 'center',
    borderRadius: 10,
  },
  headerGifContainer: {
    backgroundColor: '#4ECEB7',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerGif: {
    width: width - 30,
    height: 115,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  headerIconContainer: {
    backgroundColor: 'transparent',
    width: iconSize,
    height: iconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    paddingTop: 11,
    paddingRight: iconSize,
  },
  optionsList: {
    alignItems: 'center',
    padding: 15,
    // marginTop: -10,
  },
  option: {
    fontSize: 17,
    padding: 15,
    color: 'black',
  },
});

export default OptionsModal;