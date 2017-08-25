// @flow

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Dimensions
} from 'react-native';

const width = Dimensions.get('window').width;
import ProgressBar from 'react-native-progress/Bar';
import SimpleList from './list';
import {styles} from './list';

class GoalsList extends SimpleList {

  _renderRow(rowData) {
    // console.log('rowData from goals', rowData);
    return (
      <TouchableOpacity
        activeOpacity={ 0.4 }
        key={rowData.id}
        //{...rowData}
        onPress={ this._handlePress.bind(this, rowData) }
        //style={ [styles.item, this.props.light && styles.itemL, additional.item, warning && additional.warning] }
        >
        <View style={ [additional.info, {paddingHorizontal: 10, paddingVertical: 5}] }>
          <Text
            style={ [styles.itemText, this.props.light && styles.itemTextL] }>
            {rowData.name}
          </Text>
          <Text
            style={ [styles.itemText, this.props.light && styles.itemTextL, {fontSize: 12, color: '#8F8E94'}] }
          >
            { rowData.piece ? rowData.piece.title : null }
          </Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <ProgressBar
              style={{ height: 4 }}
              progress={(+rowData.progress.slice(0, -1)) / 100}
              width={width - 60}
              color={'#4ECEB7'}
              height={4}
              unfilledColor={'rgba(166,166,166,0.25)'}
              borderWidth={0}
              //borderRadius={0}
            />
            <Text
              style={ [styles.itemText, this.props.light && styles.itemTextL, {color: '#8F8E94', fontSize: 12, flex: 1, textAlign: 'right'}] }>
                {rowData.progress.toString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

let additional = StyleSheet.create({
  item: {
    height: null,
    paddingVertical: 15,
    paddingLeft: 20
  },
  description: {
    color: 'gray'
  },
  warning: {
    paddingLeft: 16,
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderLeftColor: '#ee2929'
  },
  warningText: {
    color: '#ee2929'
  }
});

export default GoalsList;
