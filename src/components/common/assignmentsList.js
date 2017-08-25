// @flow

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';

import SimpleList from './list';
import {styles} from './list';

import moment from 'moment';

class AssigmentsList extends SimpleList {
  calculateDaysLeft(rowData) {
    let today = moment(new Date());
    let completeDate = moment(rowData.task.due_date, 'YYYY-MM-DDTHH:mm:ssZ');
    return completeDate.diff(today, 'days');
  }
  renderDescription(rowData) {
    let description: Array = [];
    if (rowData.task.due_date && !rowData.is_finished) {
      let daysLeft = this.calculateDaysLeft(rowData);
      let warning = false;

      if (daysLeft < 3) {
        warning = true;
      }

      if (daysLeft > 0) {
        description.push(<Text key="daysLeft" style={ [warning && additional.warningText] }>{daysLeft} Days</Text>);
      } else if (daysLeft === 0) {
        description.push(<Text key="daysLeft" style={ additional.warningText }>Deadline today</Text>);
      } else if (daysLeft < 0) {
        description.push(<Text key="daysLeft" style={ additional.warningText }>{Math.abs(daysLeft)} Days Overdue</Text>);
      }

      if (rowData.task.student_class) {
        description.push(<Text key="separator"> / </Text>);
      }
    }

    if (rowData.task.student_class) {
      description.push(<Text key="class">{ rowData.task.student_class.name }</Text>);
    }

    return description;
  }

  _renderRow(rowData) {
    let daysLeft = this.calculateDaysLeft(rowData);
    let warning = false;

    if (daysLeft < 3 && !rowData.is_finished) {
      warning = true;
    }

    return (
      <TouchableOpacity
        activeOpacity={ 0.4 }
        key={rowData.id}
        {...rowData}
        onPress={ this._handlePress.bind(this, rowData) }
        style={ [styles.item, this.props.light && styles.itemL, additional.item, warning && additional.warning] }>
        <View style={ additional.info }>
          <Text
            style={ [styles.itemText, this.props.light && styles.itemTextL] }>
            {rowData.task.name}
          </Text>
          <Text style={ additional.description }>{ this.renderDescription(rowData) }</Text>
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

export default AssigmentsList;
