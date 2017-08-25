import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import {baseColor, secondColor} from '../styles';

class PageSwitcher extends React.Component {
  renderTabs() {
    return this.props.tabs.map((item, i) => {
      return (
        <TouchableOpacity
          key={ i }
          style={ [
            styles.switcherButton,
            (this.props.light ? styles.switcherButtonL : {}),
            (this.props.goal ? styles.switcherButtonG : {}),
            (i === 0 ? styles.switcherButtonLeft : {}),
            ((this.props.tabs.length - 1 === i) ? styles.switcherButtonRight : {}),
            (this.props.activeTab === i ? styles.switcherButtonActive : {}),
            (this.props.activeTab === i && this.props.light ? styles.switcherButtonActiveL : {}),
            (this.props.activeTab === i && this.props.goal ? styles.switcherButtonActiveG : {}),
            (this.props.style && this.props.style.switcherButton ? this.props.style.switcherButton : {})        
          ] }
          onPress={() => this.props.onChange(i)}>
          <Text 
            numberOfLines={1}
            style={ [
            styles.switcherButtonText,
            (this.props.light ? styles.switcherButtonTextL : {}),
            (this.props.goal ? styles.switcherButtonTextG : {}),
            (this.props.activeTab === i ? styles.switcherButtonActiveText : {}),
            (this.props.activeTab === i && this.props.light ? styles.switcherButtonActiveTextL : {}),
            (this.props.activeTab === i && this.props.goal ? styles.switcherButtonActiveTextG : {}),
            (this.props.style && this.props.style.switcherButtonText ? this.props.style.switcherButtonText : {})
          ] }>{ item }</Text>
        </TouchableOpacity>
      );
    });
  }
  render() {
    return (
      <View style={ [
          styles.switcher,
          (this.props.light ? styles.switcherL : {}),
          (this.props.goal ? styles.switcherG : {})
        ] }>
        { this.renderTabs() }
      </View>
    );
  }
}

let styles = StyleSheet.create({
  switcher: {
    backgroundColor: secondColor,
    padding: 10,
    flexDirection: 'row'
  },
  switcherL: {
    backgroundColor: 'white'
  },
  switcherG: {
    backgroundColor: '#EFEFF4',
  },
  switcherButton: {
    backgroundColor: secondColor,
    flex: 0.5,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'white'
  },
  switcherButtonL: {
    backgroundColor: 'white',
    borderColor: '#8c8c8c'
  },
  switcherButtonG: {
    backgroundColor: '#EFEFF4',
    borderColor: secondColor
  },
  switcherButtonLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderRightWidth: 0
  },
  switcherButtonRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    marginLeft: -2
  },
  switcherButtonActive: {
    backgroundColor: 'white'
  },
  switcherButtonActiveL: {
    backgroundColor: '#8c8c8c'
  },
  switcherButtonActiveG: {
    backgroundColor: secondColor,
  },
  switcherButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18
  },
  switcherButtonTextL: {
    color: '#8c8c8c',
  },
  switcherButtonTextG: {
    color: secondColor
  },
  switcherButtonActiveText: {
    color: baseColor
  },
  switcherButtonActiveTextL: {
    color: 'white'
  },
  switcherButtonActiveTextG: {
    color: 'white',
  },
});

export default PageSwitcher;
