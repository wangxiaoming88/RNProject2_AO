import React from 'react';
import {
  Text,
  TouchableOpacity
} from 'react-native';

import SimpleList from './list';
import {styles} from './list';
import Icon from 'react-native-vector-icons/MaterialIcons';

class SelectableList extends SimpleList {
  constructor() {
    super();

    this.state = {
      selectedItems: []
    };
  }

  _handlePress(data) {
    super._handlePress(data);

    if (this.state.selectedItems.indexOf(data.id) > -1) {
      this.setState({
        selectedItems: [...this.state.selectedItems.filter((item) => {
          return item !== data.id;
        })]
      });
      return;
    }
    this.setState({
      selectedItems: [...this.state.selectedItems, data.id]
    });
  }

  _renderRow(rowData) {
    let active = this.state.selectedItems.indexOf(rowData.id) > -1;
    return (
      <TouchableOpacity
        activeOpacity={ 0.4 }
        key={rowData.id}
        {...rowData}
        onPress={ this._handlePress.bind(this, rowData) }
        style={ [styles.item, this.props.light && styles.itemL, {paddingHorizontal:16}] }>
        <Text style={ [
            styles.itemText,
            this.props.light && styles.itemTextL,
            active && activeItem
          ] }>
          {rowData.name || rowData.title}
        </Text>
        { active ? (<Icon name="check" color={ activeItem.color } size={ 30 } />) : null }
      </TouchableOpacity>
    );
  }
}

let activeItem = {color: '#359865'};

export default SelectableList;
