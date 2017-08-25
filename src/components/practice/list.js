import React from 'react';
import {
  TouchableOpacity,
  Text
} from 'react-native';

import SimpleList from '../common/list';
import {styles} from '../common/list';

class PracticesList extends SimpleList {
  _renderRow(rowData) {
    return (
      <TouchableOpacity
        activeOpacity={ 0.4 }
        key={rowData.id}
        {...rowData}
        onPress={ this._handlePress.bind(this, rowData) }
        style={ [styles.item, this.props.light && styles.itemL] }>
        <Text
          style={ [styles.itemText, this.props.light && styles.itemTextL] }>
          { rowData.title }
        </Text>
      </TouchableOpacity>
    );
  }
}

export default PracticesList;
