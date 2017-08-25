import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
const width = Dimensions.get('window').width;
import {homePageStyles} from './styles';
import {baseStyles} from '../styles';
import AvatarComponent from '../common/avatar';
import ProgressBar from 'react-native-progress/Bar';

class UserInfoBlock extends React.Component {
  _getDuration = () => {
    let { total_duration } = this.props;
    let hour = 60;
    if (total_duration) {
      if (total_duration >= hour) {
        return `${ Math.round((total_duration / hour) * 10) / 10 } hour total`
      } else {
        return `${ total_duration } min total`
      }
    } else {
      return `0 min total`
    }
  };

  render() {
    return (
      <View style={ homePageStyles.userInfo }>
        <TouchableOpacity
          onPress={ this.props.goToProfile }
          style={ homePageStyles.imageWrapper }>
          <AvatarComponent
            level={this.props.level ? this.props.level.name.split("Level ") : 0}
            avatar={ this.props.avatar }
            //level={ this.props.level}
            style={ homePageStyles.image } />
        </TouchableOpacity>
        <View
          style={{ flexDirection: 'column', flex: 1 }}
        >
          <View
            style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 7,
          }}
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Text style={ [baseStyles.textThinPlatform,homePageStyles.nameText] } numberOfLines={1}>{this.props.name}</Text>
              <Text style={ [baseStyles.textThinPlatform,homePageStyles.locationText] } numberOfLines={1}>
                { this._getDuration() }
              </Text>
  {/*            { (this.props.location) ? (
                <Text style={ [baseStyles.textLightPlatform,homePageStyles.locationText] } numberOfLines={1} >
                  { this.props.location }
                </Text>
              ) : null }*/}
            </View>
            <TouchableOpacity
              onPress={ this.props.goToPractice }
              style={ homePageStyles.practiceButton }>
              <Text style={ [baseStyles.textThinPlatform, homePageStyles.practiceButtonText] }>Practice</Text>
            </TouchableOpacity>
          </View>
         <View
            style={homePageStyles.separator}
          />
          <View
            style={homePageStyles.levelDisplay}
          >
            <Text
              style={homePageStyles.levelText}
            >
              {this.props.level ? this.props.level.name : ''}
            </Text>
            <ProgressBar
              style={{ zIndex: 1 }}
              progress={this.props.level ? (+this.props.level.progress.slice(0, -1) / 100) : 0}
              width={(Platform.OS === 'ios') ? (width / 3) : (width / 5)}
              color={'white'}
              height={4}
              unfilledColor={'rgba(0,0,0,0.36)'}
              borderWidth={0}
              //borderRadius={0}
            />
            <Text
              style={homePageStyles.levelPercent}
            >
              {this.props.level ? this.props.level.progress : ''}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default UserInfoBlock;
