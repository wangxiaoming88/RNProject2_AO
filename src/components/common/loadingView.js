import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

class CustomProgress extends React.Component {
  render() {
    return (
      <View style={ [styles.wrapper, this.props.light && styles.wrapperL] }>
        { this.props.light ? (
          <ActivityIndicator size="large" />
        ) : (
          <ActivityIndicator size="large" color="white"/>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 100,
    backgroundColor: '#3cabe2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperL: {
    backgroundColor: '#f4f4f4'
  }
});

export default CustomProgress;
