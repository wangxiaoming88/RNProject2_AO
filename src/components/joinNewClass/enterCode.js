import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';

import {baseStyles} from '../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class EnterCodeTab extends React.Component {
  constructor() {
    super();
    this.state = {
      classNumber: ['', '', '', '', '', ''],
      marginView: 80
    };
  }

  onChange(num, e) {
    let text = e.nativeEvent.text;
    this.setState({
      classNumber: [
        ...this.state.classNumber.slice(0, num),
        text,
        ...this.state.classNumber.slice(num + 1)
      ]
    });
    if (text) {
      if (num === 5) {
        return;
      }
      this.refs[num + 1].focus();
    } else {
      if (num === 0) {
        return;
      }
      this.refs[num - 1].focus();
    }
  }

  handleSubmit() {
    this.props.handleClassNumberSet(this.state);
  }

  animateScroll(value, hide) {
    if (!hide) {
      var i;
      for (i = 80; i >= value; i = i - 10) {
        this.setState({marginView: i});
      }
    } else {
      var i;
      for (i = -30; i <= value; i = i + 10) {
        this.setState({marginView: i});
        console.log(this.state.marginView);
      }
    }

  }

  render() {
    return (
        <View style={ [baseStyles.content, baseStyles.contentL] }>
          <KeyboardAwareScrollView ref="scroll" animated={true}
            onKeyboardWillHide={(frames: Object) => {
              this.refs.scroll.scrollToPosition(0, 0, true);
              this.animateScroll(80, true);
            }}
            onKeyboardWillShow={(frames: Object) => {
              this.animateScroll(-30, false);
            }}
          >
          <View style={{flex: 1}}>
          <View style={ [baseStyles.centeredContainer, {flex: 0.5}] }>
            <View animated={true} style={ [styles.pageTitle,{marginTop: this.state.marginView}] }>
              <Text style={ [baseStyles.textThinPlatform, styles.text, styles.pageTitleText] }>
                Please enter your class number
              </Text>
              <Text
                style={ [baseStyles.textThinPlatform,styles.text, styles.pageSubtitleText] }
                numberOfLines={ 3 }>
                This is 6 numbers that allows the app to
              </Text>
              <Text
                style={ [baseStyles.textThinPlatform,styles.text, styles.pageSubtitleText] }>
                know which class you belong to. If you don't
              </Text>
              <Text
                style={ [baseStyles.textThinPlatform,styles.text, styles.pageSubtitleText] }>
                know it, please ask your teacher for it.
              </Text>
            </View>
          </View>
          <View style={ [baseStyles.centeredContainer, {flex: 0.5}] }>
            <View style={ styles.inputsWrapper }>
              { this.state.classNumber.map((item, i) => {
                return (
                  <TextInput
                    key={ i }
                    keyboardType="numeric"
                    style={ styles.input }
                    maxLength={ 1 }
                    onChange={ this.onChange.bind(this, i) }
                    ref={ i } />
                );
              }) }
            </View>
            <TouchableOpacity
              style={ [baseStyles.submitButton, baseStyles.submitButtonSecondary, styles.submitButton] }
              onPress={ this.handleSubmit.bind(this) }>
              <Text style={ [baseStyles.textThinPlatform,baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText] }>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
          </View>
          </KeyboardAwareScrollView>
        </View>
    );
  }
}
let styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 16
  },
  pageTitle: {
    marginBottom: 20
  },
  pageTitleText: {
    fontSize: 21,
    marginBottom: 15,
    textAlign: 'center'
  },
  pageSubtitleText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center'
  },
  input: {
    width: 40,
    height: 60,
    backgroundColor: 'white',
    color: 'black',
    fontSize: (Platform.OS === 'ios') ? 22 : 18,
    margin: 5,
    padding: 0,
    textAlign: 'center'
  },
  inputsWrapper: {
    flexDirection: 'row',
    marginBottom: 30,
    marginHorizontal: 20
  },
  submitButton: {
    marginHorizontal: 20
  }
});
export default EnterCodeTab;
