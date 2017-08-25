import React from 'react';
import {
  View,
  TextInput,
  StyleSheet
} from 'react-native';

// import {baseStyles} from '../../components/styles';

import Icon from 'react-native-vector-icons/MaterialIcons';

class SortingComponent extends React.Component {
  constructor() {
    super();
  }

  _handleOnchange = (text) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.props.handleOnChange(text), 500);
  };

  render() {
    return (
      <View style={ styles.wrapper }>
        <TextInput
          keyboardType="web-search"
          onChangeText={ text => this._handleOnchange(text) }
          clearButtonMode="while-editing"
          autoCapitalize="none"
          style={ styles.textinput } />
        <Icon name="search" color={ 'gray' } size={ 24 } style={ styles.icon } />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f7f7f9',
    padding: 10,
    borderStyle: 'solid',
    borderColor: '#c8c7cc',
    borderBottomWidth: 1,
    position: 'relative'
  },
  textinput: {
    backgroundColor: '#d9d9dd',
    height: 38,
    fontSize: 16,
    borderRadius: 5,
    paddingLeft: 40
  },
  icon: {
    backgroundColor: 'transparent',
    height: 24,
    width: 24,
    position: 'absolute',
    top: 17,
    left: 14
  }
});

export default SortingComponent;
