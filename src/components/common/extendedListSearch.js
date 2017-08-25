import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';

import SimpleList from './list';
import {styles} from './list';

import AvatarComponent from './avatar';

class ComplexList extends SimpleList {
  renderDescription(rowData) {
    if (typeof this.props.descriptionField === 'string') {
      return rowData[this.props.descriptionField];
    }

    if (this.props.descriptionField instanceof Array) {
      return this.props.descriptionField.map((item) => {
        return rowData[item];
      }).join(' ');
    }
  }

  _onEndReached() {
    this.props.onEndReached();
  }

  _renderRow(rowData) {
    return (
      <TouchableOpacity
        activeOpacity={ 0.4 }
        key={rowData.id}
        {...rowData}
        onPress={ this._handlePress.bind(this, rowData) }
        style={ [styles.item, this.props.light && styles.itemL, additional.item] }>
        { typeof rowData.avatar !== 'undefined' ? (
          <AvatarComponent
            style={ additional.image }
            avatar={ rowData.avatar } />
        ) : null }
        <View style={ additional.info }>
          <Text
            style={ [styles.itemText, this.props.light && styles.itemTextL, {}] }>
            {rowData.name}
          </Text>
          { this.props.descriptionField ? (
            <Text style={ additional.description }>{ this.renderDescription(rowData) }</Text>
          ) : null }
        </View>
      </TouchableOpacity>
    );
  }
}

let additional = StyleSheet.create({
  item: {
    height: null,
    paddingVertical: 15
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50/2,
    flex: 0,
    marginRight: 10,
    marginLeft: 10,
  },
  info: {
    flex: 0.9,
    marginTop: 15
  },
  description: {
    color: 'gray'
  }
});

export default ComplexList;
