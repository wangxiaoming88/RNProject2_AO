import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
} from 'react-native';

class AvatarComponent extends React.Component {
  constructor() {
    super();
  }

  render() {
    let imageSource = this.props.avatar ? (
      {uri: this.props.avatar}
    ) : require('./images/custom_avatar.png');
    return (
      <View
        style={this.props.style, {backgroundColor: 'transparent'}}
      >
        <Image style={ this.props.style }
          resizeMode="cover"
          source={ imageSource }
        />
        {
          (this.props.level)
          ?
            <View
              style={{ backgroundColor: '#FF7515', height: 30, width: 30,
                position: 'absolute',
                left: (Platform.OS === 'ios') ? 65 : 64,
                top: (Platform.OS === 'ios') ? 65 : 64,
                zIndex: 1,
                borderRadius: (Platform.OS === 'android') ? 90 : 45,
                borderWidth: 1,
                borderColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ color: 'white' }}
              >
                {this.props.level}
              </Text>
            </View>
          :
            null
        }
      </View>
    );
  }
}

export default AvatarComponent;
