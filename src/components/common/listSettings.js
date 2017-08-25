import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Platform
} from 'react-native';

import Utils from '../../services/utils';

import {baseStyles,baseColor} from '../../components/styles';
import EmptyView from './emptyView';
import CustomProgress from './loadingView';
import Icon from 'react-native-vector-icons/Entypo';

class SimpleList extends React.Component {
  constructor() {
    super();

    this._onEndReached = Utils.debounce(this._onEndReached, 200);
  }

  _handlePress(data) {
    return this.props.onPress && this.props.onPress(data);
  }

  /**
   * This function fires when bottom of the list reached
   * @abstract
   */
  _onEndReached() {}

  /**
   * Renders footer loader on data load.
   */
  _renderFooter() {
    if (this.props.status === 'fetching_new_page') {
      return (
        <CustomProgress {...this.props} />
      );
    }
    return null;
  }

  _renderRow(rowData) {
    return (
      <TouchableOpacity
        activeOpacity={ 0.4 }
        key={rowData.id}
        {...rowData}
        onPress={ this._handlePress.bind(this, rowData) }
        style={ [styles.item, this.props.light && styles.itemL, {
          marginLeft:14,marginRight: 14,}] }>
        <Text style={ [styles.itemText, this.props.light && styles.itemTextL, baseStyles.textThinPlatform, {
    fontWeight: (Platform.OS === "android") ? 'bold' : '400'}] }>
          {rowData.name || rowData.title}
        </Text>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center'
        }} >
          <Icon name="dots-three-horizontal" size={ 15 } resizeMode={'contain'} color="#c7c7cc" />
        </View>
      </TouchableOpacity>
    );
  }

  renderList(_dataSource) {
    if (this.props.status === 'fetching') {
      return (
        <CustomProgress {...this.props} />
      );
    }

    if (this.props.list.length) {
      return (
        <ListView
          dataSource={_dataSource}
          style={ [styles.list, this.props.light && styles.listL] }
          renderRow={ this._renderRow.bind(this) }
          onEndReached={ this._onEndReached.bind(this) }
          renderFooter={ this._renderFooter.bind(this) }
          renderSeparator={ (sectionID, rowID) => {
            let last = this.props.list.length - rowID - 1 === 0;

            if (last) {
              return null;
            }
            return (
              <View key={`${sectionID}-${rowID}`} style={ [styles.separator, this.props.light && styles.separatorL] } />
            );
          } } />
      );
    } else {
      return (
        <EmptyView>{ this.props.emptyText || 'Nothing here yet' }</EmptyView>
      );
    }
  }

  render() {
    let _ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let _dataSource = _ds.cloneWithRows([...this.props.list]);
    return this.renderList(_dataSource);
  }
}

export const styles = StyleSheet.create({
  list: {
    backgroundColor: baseColor,
  },
  listL: {
    backgroundColor: 'white'
  },
  item: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: baseColor,
  },
  itemL: {
    backgroundColor: 'white'
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
  },
  separatorL: {
    marginLeft: 14,
    backgroundColor: 'lightgrey'
  },
  itemText: {
    color: 'white',
    fontSize: 17,
  },
  itemTextL: {
    color: 'black',
    fontSize: 17
  },
});

export default SimpleList;
