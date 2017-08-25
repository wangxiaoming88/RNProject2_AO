import React from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  Image,
  Modal,
} from 'react-native';

import OptionsModal from './optionsModal';

import SimpleList from '../../components/common/list';
import {styles} from '../../components/common/list';

import { connect } from 'react-redux';
import { saveInterimDataGoal } from '../../redux/actions/goals';

class PracticesList extends SimpleList {
  constructor() {
    super();
    this.state ={
      isOptionsModalVisible: false,
      isCreateModalVisible: false,
    }
  }

  getPiecePracticeTime = (pieceUrl, piecePractice) => {
    if (piecePractice.length > 0) {
      let time = piecePractice.reduce((sum, current) => {
        return sum + current.duration
      }, 0);
      return `${ time } min`;
    } else return '0 min'
  };

  _renderRow(rowData, secId, rowId) {
    if (this.props.checkKey) {
      if (rowId < 3) {
        return (
          <View
            style={{ flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginRight: 14,
            }}
          >
            <TouchableOpacity
              activeOpacity={ 0.4 }
              key={rowData.id}
              {...rowData}
              onPress={ this._handlePress.bind(this, rowData) }
              style={ [styles.item, this.props.light && styles.itemL,
              {marginHorizontal: 14,
                flex: 6,
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'flex-start',
               paddingVertical: 7,
              }] }>
              <Text
                style={ [styles.itemText, this.props.light && styles.itemTextL] }
                numberOfLines={ 1 }
              >
                { rowData.title }
              </Text>
              <Text
                style={ [styles.itemText, this.props.light && styles.itemTextL, { color: '#8F8E94', fontSize: 15 } ] }
              >
                {this.getPiecePracticeTime(
                  rowData.url,
                  this.props.practiceTime.filter(practice => {
                    if ((practice.piece === rowData.url) && (practice.duration > 0)) {
                      return practice
                    }
                  })
                )}
                {/*{ rowData.id } Hours Practiced*/}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              }}
              onPress={() => {
                let data = { duration: null, intervalTab: 0, pieceTitle: rowData.title, pieceUrl: rowData.url, };
                this.setState({ isOptionsModalVisible: true });
                this.props.dispatch(saveInterimDataGoal(data))
              }}
            >
              <Image
                source={{ uri: 'more', width: 20, height: 20 }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        );
      } else return null;
    } else {
      let isCreated = !!this.props.goals.list.filter(goal => goal.piece.url === rowData.url).length;
      return (
        <View
          style={{ flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginRight: 14,
          }}
        >
          <TouchableOpacity
            activeOpacity={ 0.4 }
            key={rowData.id}
            {...rowData}
            onPress={ !isCreated
              ? this._handlePress.bind(this, rowData)
              : () => Alert.alert('Add piece', 'Goal for this piece is already created')
            }
            style={ [styles.item, this.props.light && styles.itemL,
            {paddingHorizontal: 15,
              flex: 6,
             flexDirection: 'column',
             justifyContent: 'space-between',
             alignItems: 'flex-start',
             paddingVertical: 7,
             borderColor: '#4ECEB7',
            borderLeftWidth: isCreated ? 4 : 0,
            }] }>
            <Text
              style={ [styles.itemText, this.props.light && styles.itemTextL] }>
              { rowData.title }
            </Text>
            <Text
              style={ [styles.itemText, this.props.light && styles.itemTextL, { color: '#8F8E94', fontSize: 15 } ] }>
              { rowData.id } Hours Practiced
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            }}
            onPress={() => {
              console.warn('more pressed 2');
            }}
          >
            <Image
              source={{ uri: 'more', width: 20, height: 20 }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }
}

function props(state) {
  return {
    goals: state.goals
  };
}

export default connect(props)(PracticesList);
