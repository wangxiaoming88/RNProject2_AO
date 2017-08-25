import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';

import RefreshControl from '../../components/common/refreshControl';
import PageTitle from '../../components/common/pageTitle';

import SimpleListBlock from '../../components/common/listBlock';

import {baseStyles} from '../../components/styles';
import {connect} from 'react-redux';
import {fetchMyPractices} from '../../redux/actions/practice';

import PracticesList from './list';
import Analytics from '../../services/mixpanelAnalytics';

const { width, height } = Dimensions.get('window');

class EmptyMusicLibrary extends React.Component {
  constructor() {
    super();
    this.title = 'Music Library';
    //this._onRefresh = this._onRefresh.bind(this);
  }

  addNewPractice() {
    this.props.navigator.push({id: 'addPiecePage', onSuccessCb: this.props.onRefresh});
  }

  // _onRefresh(isFirst = false) {
  //   this.isFirst = isFirst;
  //   this.props.dispatch(fetchMyPractices());
  //   (this.props.practice.list.length === 0) ? (this.setState({ isEmpty: true })) : (this.setState({ isEmpty: false }));
  // }

  render() {
    return (
      <View style={ [baseStyles.container, {backgroundColor: '#efeff4'}] }>
        <PageTitle
          title={ this.title }
        />
        <View
          style={{
            marginTop: 20,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: 'illustration'}}
            style={{width: width - 100, height: height / 2}}
            resizeMode={'contain'}
          />
          <Text
            style={{ textAlign: 'center', width: width - 70, color: '#6D6D72', fontSize: 15 }}
          >
            Your music library is a place to keep track of all the music you are prcticing, to set goals or track time for each.
          </Text>
           <View style={ {padding: 30} }>
            <TouchableOpacity
              onPress={ () => this.addNewPractice() }
              style={ [baseStyles.submitButton, baseStyles.submitButtonSecondary, { width: width - 70 }] }>
              <Text
                style={ [baseStyles.textThinPlatform,baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText] }>Add Your First Piece
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

function props(state){
  return {
    practice: state.practice
  };
}

export default connect(props)(EmptyMusicLibrary);
