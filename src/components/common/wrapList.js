import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Dimensions,
  Image,
} from 'react-native';

const width = Dimensions.get('window').width;

import Utils from '../../services/utils';

import {baseStyles,baseColor} from '../../components/styles';
import EmptyView from './emptyView';
import CustomProgress from './loadingView';

class WrapList extends React.Component {
  constructor() {
    super();
    this.achievements = {
      '1st Piece Practiced'  : 'icon1st',
      '10th Piece Practiced' : 'icon10th',
      '50th Piece Practiced' : 'icon50th',
      '250 Hours Practiced'  : 'icon250',
      '500 Hours Practiced'  : 'icon500',
      '1000 Hours Practiced' : 'icon1000',
    };
    // this.dataSource = [
    //   {
    //     uri: 'icon1st',
    //     title: '1st Piece Practiced'
    //   },
    //   {
    //     uri: 'icon10th',
    //     title: '10th Piece Practiced'
    //   },
    //   {
    //     uri: 'icon50th',
    //     title: '50th Piece Practiced'
    //   },
    //   {
    //     uri: 'icon250',
    //     title: '250 Hours Practiced'
    //   },
    //   {
    //     uri: 'icon500',
    //     title: '500 Hours Practiced'
    //   },
    //   {
    //     uri: 'icon1000',
    //     title: '1000 Hours Practiced'
    //   },
    // ];
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
      // <TouchableOpacity
      //   activeOpacity={ 0.4 }
      //   key={rowData.id}
      //   {...rowData}
      //   onPress={ this._handlePress.bind(this, rowData) }
      //   style={ [styles.item, this.props.light && styles.itemL] }>
      //   <Text style={ [baseStyles.textLightPlatform,styles.itemText, this.props.light && styles.itemTextL] }>
      //     {rowData.name || rowData.title}
      //   </Text>
      // </TouchableOpacity>
      rowData.is_achived
      ?
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: width / 3 - 20,
            margin: 5,
            height: 105,
            // width: 80
          }}
        >
          <Image 
            source={{ uri: this.achievements[rowData.name], height: 80, width: 70}}
            resizeMode={'contain'}
          />
          <Text
            style={{ fontSize: 10, width: 60, textAlign: 'center' }}
            numberOfLines={2}
          >
            {rowData.name}
          </Text>
        </View>
      :
        <View />
    );
  }

  renderList(_dataSource) {
    if (this.props.status === 'fetching') {
      return (
        <CustomProgress {...this.props} />
      );
    }

    if (this.props.achievements) {
      return (
        <ListView
          contentContainerStyle={styles.contentListView}
          dataSource={_dataSource}
          style={ [styles.list, this.props.light && styles.listL] }
          renderRow={ this._renderRow.bind(this) }
          //onEndReached={ this._onEndReached.bind(this) }
          //renderFooter={ this._renderFooter.bind(this) }
        />
      );
    } else {
      return (
        <EmptyView>{ this.props.emptyText || 'Nothing here yet' }</EmptyView>
      );
    }
  }

  render() {
    // console.log('WrapList', this.props.achievements);
    let _ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let _dataSource = _ds.cloneWithRows(this.props.achievements ? this.props.achievements : []); // [...this.props.list]
    return this.renderList(_dataSource);
  }
}

export const styles = StyleSheet.create({
  contentListView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingLeft: 15,
  },
  list: {
    backgroundColor: baseColor,
    // height: 200,
    flex: 1,
    // flexWrap: 'wrap',
    // flexDirection: 'row',
  },
  listL: {
    backgroundColor: 'white',
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
    backgroundColor: 'lightgrey'
  },
  itemText: {
    color: 'white',
    fontSize: 14
  },
  itemTextL: {
    color: 'black'
  },
});

export default WrapList;
