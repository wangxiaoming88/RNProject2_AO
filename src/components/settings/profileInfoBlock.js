import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';

const width = Dimensions.get('window').width;

import ProgressBar from 'react-native-progress/Bar';
import AvatarComponent from '../common/avatar';
import {baseStyles, baseColor} from '../styles';

// import profileBgImage from './images/settings_profile_bg.png';

class ProfileInfoBlock extends React.Component {
  constructor() {
    super();

    this.state = {
      width: 0,
      color: '#2497d0'
    };
  }

  updateWidth(width) {
    this.setState({width});
  }

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
    let { level } = this.props;
    return (
      <View
        style={ styles.profileInfoWrapper }
        onLayout={ (e) => {
          // this.updateWidth(e.nativeEvent.layout.width);
          this.updateWidth(Dimensions.get('window').width);
        }}>
        <StatusBar backgroundColor={this.state.color} animated={true} barStyle="light-content" />
{/*        <Image source={ profileBgImage }
          resizeMode={'contain'}
          style={ [
            styles.profileInfoWrapperImage,
            {width: this.state.width, backgroundColor: 'red'}
          ] }
          resizeMode="cover">*/}
        <View
          style={styles.profileInfoWrapperImage}
        >  
          <View style={ [baseStyles.centeredContainer, {backgroundColor: 'transparent'}] }>
            <View style={ styles.imageWrapper }>
              <AvatarComponent
                level={this.props.level ? this.props.level.name.split("Level ") : 0}
                avatar={ this.props.avatar }
                style={ styles.image } />
            </View>

            <Text style={ [baseStyles.text, styles.nameText, baseStyles.textThinPlatform] }>{ this.props.name }</Text>
            <Text style={ [baseStyles.text, styles.locationText, baseStyles.textLightPlatform]}>{ this._getDuration() }</Text>
{/*            { (this.props.location) ? (
              <Text style={ [baseStyles.text, styles.locationText, baseStyles.textLightPlatform] } numberOfLines={1} ellipsizeMode="middle">
                { this.props.location }
              </Text>
            ) : null }*/}
          </View>
          <View
            style={styles.separator}
          />
          <View
            style={styles.levelDisplay}
          >
            <Text
              style={styles.levelText}
            >
              {level ? level.name : ''}:
            </Text>
            <ProgressBar
              style={{ zIndex: 1 }}
              progress={level ? (+this.props.level.progress.slice(0, -1) / 100) : 0}
              width={width / 1.5}
              color={'white'}
              height={4}
              unfilledColor={'rgba(0,0,0,0.36)'}
              borderWidth={0}
              //borderRadius={0}
            />
            <Text
              style={styles.levelPercent}
            >
              {level ? level.progress : ''}
            </Text>
          </View>
          <TouchableOpacity style={[styles.editProfileButton,{
            padding:0,
            borderColor: '#ffffff',
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: 'rgba(0,0,0,0)'
            }]}
            onPress={ this.props.handleEditPress } >
            <Text
              style={[baseStyles.textThinPlatform,{padding: 0, margin:0,
                fontWeight: (Platform.OS === "android") ? '500' : '400',
                fontSize: 17,
                color: '#ffffff'}]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      {/*  </Image>*/}
{/*          <View
            style={styles.separator}
          />
          <View
            style={styles.levelDisplay}
          >
            <Text
              style={styles.levelText}
            >
              Level 6:
            </Text>
            <View
              style={{ flex: 3}}
            >
              <ProgressBar
                style={{ zIndex: 1 }}
                progress={0.9}
                //width={width / 3}
                color={'white'}
                height={4}
                unfilledColor={'rgba(0,0,0,0.36)'}
                borderWidth={0}
                //borderRadius={0}
              />
            </View>
            <Text
              style={styles.levelPercent}
            >
              96 %
            </Text>
          </View>*/}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 0.3,
    marginVertical: 8,
    borderColor: 'rgba(255,255,255,0.24)',
    marginHorizontal: 10,
  },
  levelDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
    paddingHorizontal: 10,
  },
  levelText: {
    //flex: 1,
    color: 'white',
    //backgroundColor: 'red',
    height: 20,
    fontSize: (Platform.OS === "android") ? 17 : 12,
    //fontWeight: '500',
    //width: width / 15,
    textAlign: 'left',
  },
  levelPercent: {
    color: '#b3cee9',
    //backgroundColor: 'red',
    height: 20,
    //flex: 1,
    fontSize: (Platform.OS === "android") ? 17 : 12,
    //fontWeight: '500',
    //width: width / 20,
    textAlign: 'right',
    zIndex: 0,
  },
  profileInfoWrapper: {
    backgroundColor: baseColor,
    marginTop: (Platform.OS === "android") ? 0 : 15
  },
  profileInfoWrapperImage: {
    flex: 1,
   // height: Dimensions.get('window').height / 2.8,
    paddingTop: 16,
    backgroundColor: '#1b97d3'
  },
  imageWrapper: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'white',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (Platform.OS === "android") ? 48 : 48,
    height: (Platform.OS === "android") ? 96 : 96,
    width: (Platform.OS === "android") ? 96 : 96,
    // borderRadius: Dimensions.get('window').height / 4.6 / 2 + 4,
    // height: Dimensions.get('window').height / 4.6 + 4,
    // width: Dimensions.get('window').height / 4.6 + 4
  },
  image: {
    // height: Dimensions.get('window').height / 4.6,
    // width: Dimensions.get('window').height / 4.6,
    // borderRadius: Dimensions.get('window').height / 4.6 / 2
    height: (Platform.OS === "android") ? 94 : 94,
    width: (Platform.OS === "android") ? 94 : 94,
    borderRadius: (Platform.OS === "android") ? 94 : 47,
  },
  nameText: {
        color: 'white',
    fontSize: (Platform.OS === "android") ? 19 : 14,
    //fontWeight: '500',
    //width: width / 3,
    textAlign: 'left',
    // fontWeight: '500',
    marginTop: 12,
    // fontSize: 18,
  },
  locationText: {
    marginVertical: 6,
    // fontWeight: '400',
    // fontSize: 16,
    // color: '#9ed1ed',
    color: '#b3cee9',
    fontSize: 14,
    fontWeight: '400',
    //width: width / 3,

  },
  editProfileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 2,
    paddingHorizontal: 10
  }
});

export default ProfileInfoBlock;
