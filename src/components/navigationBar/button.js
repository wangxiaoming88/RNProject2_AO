import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  Platform,
  Dimensions
} from 'react-native';

import {navigationStyles} from './styles';
import {baseStyles} from '../styles';

var width = Dimensions.get('window').width;

class NavigationButton extends React.Component {
  constructor() {
    super();

    this.imagesMap = {
      'home': require('./images/home.png'),
      'homework': require('./images/homework.png'),
      'music library': require('./images/music_library.png'),
      'practice': require('./images/practice.png'),
      'settings': require('./images/settings.png'),

      'home_a': require('./images/home_a.png'),
      'homework_a': require('./images/homework_a.png'),
      'music library_a': require('./images/music_library_a.png'),
      'practice_a': require('./images/practice_a.png'),
      'settings_a': require('./images/settings_a.png'),
    };

  }

  _capitalizeFirstLetter(str) {
    if(str === "music library") {
      return "Music Library";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render() {
    return (
      <TouchableOpacity
        style={ [navigationStyles.navigationItem] }
        onPress={ this.props.changeTab }>
        <Image
          source={ this.props.isActive ? this.imagesMap[`${this.props.item}_a`] : this.imagesMap[this.props.item] }
          style={ {width: 25, height: 25, marginTop: 4 }} />
        <Text numberOfLines={1} style={ [baseStyles.textLightPlatform,this.props.isActive && navigationStyles.navigationItemTextActive, {fontSize: (Platform.OS === "android") ? 11 : (width === 320) ? 9 : 10,marginBottom: 2, marginTop: 3}] }>{ this._capitalizeFirstLetter(this.props.item) }</Text>
      </TouchableOpacity>
    );
  }
}

export default NavigationButton;
