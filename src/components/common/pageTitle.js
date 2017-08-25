import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {baseStyles, secondColor} from '../../components/styles';

const width = Dimensions.get('window').width;

class PageTitle extends React.Component {
  showLeftButton() {
    if (this.props.onLeftButton) {
      return (
        <TouchableOpacity onPress={ this.props.onLeftButton }
          style={[styles.button, styles.left]}>
          { this.props.iconLeft ? (
            <Icon name={ this.props.iconLeft } size={25} color="#fff" />
          ) : null }
          <View style={styles.viewButton}>
            <Text style={[styles.pageTitleText,baseStyles.textThinPlatform]}>
              { this.props.leftButtonText }
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (<View style={[styles.button, styles.left]} />);
    }
  }

  showRightButton() {
    if (this.props.onRightButton) {
      return (
        <TouchableOpacity onPress={ this.props.onRightButton }
          style={[styles.button, styles.right]}>
          <View style={styles.viewButton}>
            <Text style={ [styles.pageTitleText,baseStyles.textThinPlatform] }>
              { this.props.rightButtonText }
            </Text>
          </View>
          { this.props.iconRight ? (
            <Icon name={ this.props.iconRight } size={25} color="#fff" />
          ) : null }
        </TouchableOpacity>
      );
    } else {
      return (<View style={[styles.button, styles.right]} />);
    }
  }

  render() {
    return (
      <View backgroundColor={secondColor} style={ [styles.pageTitle, this.props.style, ] }>
        { this.showLeftButton() }
        <View style={styles.centerTitle}>
          <Text
            style={ [styles.pageTitleText,baseStyles.textThinPlatform] }
            ellipsizeMode={ 'tail' }
            numberOfLines={ 1 }
          >
            { this.props.title }
          </Text>
        </View>
        { this.showRightButton() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageTitle: {
    backgroundColor: '#1b97d3',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  centerTitle: {
    ...baseStyles.center,
    flex: 1,
    paddingVertical: 8,
  },
  pageTitleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: (Platform.OS === 'ios') ? '400' : 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.25,
    paddingVertical: 6,
  },
  left: {
    justifyContent: 'flex-start',
    paddingLeft: 8,
  },
  right: {
    justifyContent: 'flex-end',
    paddingRight: 8,
  },
  viewButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PageTitle;
