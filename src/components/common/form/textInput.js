import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';

import {baseStyles} from '../../styles';

class CustomTextInput extends React.Component {
  showError() {
    let _error;
    if (this.props.error) {
      _error = (
        <View style={{backgroundColor: 'transparent'}}>
          { (this.props.touched && this.props.error) ? (<Text style={ [styles.errorText, this.props.light && styles.errorTextL, {marginTop:4}] }>{ this.props.error }</Text>) : null }
        </View>
      );
    } else {
      _error = null;
    }

    return _error;
  }

  render() {
    return (
      <View style={{marginBottom: 0}}>
        <TextInput
          placeholderTextColor={this.props.light ? 'lightgray' : '#b2ddf2'}
          {...this.props}
          style={ [baseStyles.textThinPlatform,
            styles.input,
            this.props.light && styles.inputL,
            {
              marginBottom: 6,
              marginLeft: 0,
              paddingLeft: 0,
              marginTop: 6,
              paddingBottom: 0,
              paddingTop:0,
            },
            // (Platform.OS === 'ios') ? this.props.style : undefined,
            this.props.style
            ] } />
        { this.props.noborder ? null : (
          <View style={ [styles.borderBottom,
            this.props.light && styles.borderBottomL,
            {
              marginTop: 0,
              marginBottom: 0,
              paddingBottom: 0,
              paddingTop:0
            }] } />
        ) }
        { this.showError() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  inputL: {
    color: 'gray'
  },
  errorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '200'
  },
  errorTextL: {
    color: 'red',
  },
  borderBottom: {
    height: 1,
    backgroundColor: '#b2ddf2'
  },
  borderBottomL: {
    backgroundColor: 'lightgray'
  }
});

export default CustomTextInput;
