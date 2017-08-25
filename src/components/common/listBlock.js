import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // Platform
} from 'react-native';

import {baseStyles} from '../../components/styles';
import SimpleList from './listSettings';
import WrapList from './wrapList';

class SimpleListBlock extends React.Component {
  showTitle() {
    let _title;
    if (this.props.title) {
      _title = (
        <View style={ baseStyles.blockTitle } >
          <Text style={ [baseStyles.textThinPlatform, baseStyles.blockTitleText, this.props.light && baseStyles.blockTitleTextL ] }>{ this.props.title.toUpperCase() }</Text>
          { this.props.onTitleLinkPress ? (
            <TouchableOpacity onPress={ this.props.onTitleLinkPress }>
              <Text style={ [baseStyles.textThinPlatform, baseStyles.blockTitleText, baseStyles.link, this.props.light && baseStyles.linkL ] }>
                { this.props.titleLink.toUpperCase() }
              </Text>
            </TouchableOpacity>
          ) : null }
        </View>);
    } else {
      _title = null;
    }

    return _title;
  }

  generateList() {
    if (this.props.listElement) {
      return React.createElement(this.props.listElement, this.props);
    } else if (this.props.wrap) {
      return (<WrapList {...this.props} />);
    } else {
      return (<SimpleList {...this.props} />);
    }
  }

  render() {
    return (
      <View style={ styles.block }>
        { this.showTitle() }
        <View style={ styles.list }>
          { this.generateList() }
        </View>
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  block: {

  },
  list: {
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  }
});

export default SimpleListBlock;
