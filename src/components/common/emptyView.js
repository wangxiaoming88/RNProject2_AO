import React from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import {baseStyles} from '../../components/styles';

class EmptyView extends React.Component {
  render() {
    return (
      <View style={ emptyViewStyles.emptyView } {...this.props}>
        <Text style={ [baseStyles.textThinPlatform,emptyViewStyles.emptyViewText] }>{ this.props.children || 'Nothing here' }</Text>
      </View>
    );
  }
}

const emptyViewStyles = StyleSheet.create({
  emptyView: {
    padding: 20,
    backgroundColor: 'white'
  },
  emptyViewText: {
    color: '#939393',
    textAlign: 'center'
  }
});

export default EmptyView;
