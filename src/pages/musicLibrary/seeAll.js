import React from 'react';
import {
  View,
  ScrollView,
  Modal,
} from 'react-native';

import RefreshControl from '../../components/common/refreshControl';
import PageTitle from '../../components/common/pageTitle';

import SimpleListBlock from '../../components/common/listBlock';
import EmptyMusicLibrary from './emptyMusicLibrary';
import { baseStyles } from '../../components/styles';
import { connect } from 'react-redux';
import { fetchMyPractices } from '../../redux/actions/practice';
import { saveInterimDataGoal } from '../../redux/actions/goals';

import PracticesList from './list';
import Analytics from '../../services/mixpanelAnalytics';

class SeeAllMusicLibraryPage extends React.Component {
  constructor() {
    super();
    this.title = '';
    this.isFirst = true;
    this.state = {
      isEmpty: true,
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this._onRefresh(true);
    Analytics.view(this.title);
    this.title = this.props.route.title;
    //console.log('musicLibraryProps', this.props);
  }

  handlePress(data) {
    if (this.props.route.editingCreatingGoal) {
      this.props.dispatch(saveInterimDataGoal({
        pieceTitle: data.title,
        pieceUrl: data.url,
      }));
      this.props.navigator.pop();
      this.props.route.showModal();
    } else {
      let args = {
        name: data.title,
        type: 'piece',
        data
      };

      this.props.route.refTabView.goToPage(2);
      this.props.navigator.replacePreviousAndPop({id: 'main', args,});
    }
  }

  _onRefresh(isFirst = false) {
    this.isFirst = isFirst;
    this.props.dispatch(fetchMyPractices());
  }

  render() {
    return (
        <View style={ baseStyles.container }>
          <PageTitle
            iconLeft="navigate-before"
            // title={ this.title }
            onLeftButton={ () => {
              this.props.navigator.pop();
              this.props.route.editingCreatingGoal ? this.props.route.showModal() : null;
            }}
            leftButtonText="Back"
          />
          <ScrollView
            style={ [baseStyles.content, baseStyles.contentL] }
            refreshControl={
              <RefreshControl
                refreshing={ this.isFirst && this.props.practice.status === 'fetching' }
                onRefresh={ this._onRefresh.bind(this) }
              />
            }
          >
            <SimpleListBlock light {...this.props.practice}
              onPress={ this.handlePress.bind(this) }
              listElement={ PracticesList }
            />
          </ScrollView>
        </View>
    );
  }
}

function props(state){
  return {
    practice: state.practice,
    goals: state.goals
  };
}

export default connect(props)(SeeAllMusicLibraryPage);
