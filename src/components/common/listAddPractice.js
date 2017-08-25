import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView
} from 'react-native';

import Utils from '../../services/utils';

import {baseStyles,baseColor} from '../../components/styles';
import EmptyView from './emptyView';
import CustomProgress from './loadingView';

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
        style={ [styles.item, (this.props.light || this.props.gray) && styles.itemL] }>
        <Text style={ [baseStyles.textThinPlatform, styles.itemText, (this.props.light || this.props.gray) && styles.itemTextL] }>
          { rowData.name || rowData.title }
        </Text>
        { rowData.composer &&
          <Text style={ styles.composer }>
            { rowData.composer }
          </Text>
        }
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
          style={ [styles.list, this.props.light && styles.listL, this.props.gray && styles.listG] }
          renderRow={ this._renderRow.bind(this) }
          onEndReached={ this._onEndReached.bind(this) }
          renderFooter={ this._renderFooter.bind(this) }
          keyboardShouldPersistTaps={true}
          renderSeparator={ (sectionID, rowID) => {
            // let last = this.props.list.length - rowID - 1 === 0;
            return (
              <View
                key={`${sectionID}-${rowID}`}
                style={[ styles.separator, (this.props.light || this.props.gray) && styles.separatorL ]}
              />
            )
          }} />
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
    backgroundColor: baseColor
  },
  listL: {
    backgroundColor: 'white',
  },
  listG: {
    backgroundColor: '#EFEFF4',
  },
  item: {
    // height: 50,
    // flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: 'space-between',
    backgroundColor: baseColor,
    padding: 15,
    paddingVertical: 10,
  },
  itemL: {
    backgroundColor: 'white'
  },
  composer: {
    fontSize: 15,
    color: '#A09FA5',
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
  },
  separatorL: {
    backgroundColor: 'lightgrey'
  },
  itemText: {
    color: 'white',
    fontSize: 17,
    marginBottom: 5,
  },
  itemTextL: {
    color: 'black'
  },
});

export default SimpleList;
