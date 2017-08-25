import React from 'react';

import HomePage from '../home/page';
import HomeWorkPage from '../homeWork/page';
import MusicLibraryPage from '../musicLibrary/page';
import PracticePage from '../practice/page';
import ProfilePage from '../settings/profile';

import Navigation from '../../components/navigationBar/navigation';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import SplashScreen from '@remobile/react-native-splashscreen';

import {
  InteractionManager,
  AsyncStorage
} from 'react-native';

import Utils from '../../services/utils';

import {fetchUserData, fetchMyLevel} from '../../redux/actions/user';
import {
  fetchAssigments,
  fetchCompletedAssigments
} from '../../redux/actions/assignments';
import {fetchProgressChartData, fetchProgressChartDataBetweenDates} from '../../redux/actions/progressChart';
import {fetchMyPractices, fetchMyPracticesTime} from '../../redux/actions/practice';
import {fetchJoinedClasses} from '../../redux/actions/classes';
import {fetchMyGoals} from '../../redux/actions/goals';
import Analytics from '../../services/mixpanelAnalytics';

import {connect} from 'react-redux';

class MainPage extends React.Component {
  constructor() {
    super();

    this.state = {
      PAGES: ['Home', 'Homework', 'Practice', 'Music Library', 'Settings'],
      isFirst: true,
      tabHistory: ['Home'],
    };
  }

  componentDidMount() {

    if (this.props.route.args) {
      this.refs.tabView.goToPage(2);
    }
    // console.log('current date', firstDay, lastDay);
    // const { route } = this.props;
    // const allowUserFetchData = false;
    let _allDataFetches = [
      fetchMyLevel,
      fetchMyGoals,
      // UserInfoBlock
      // fetchUserData,
      // HomePage
      fetchAssigments,
      fetchProgressChartData,
      fetchProgressChartDataBetweenDates,
      // HomeWorkPage
      fetchCompletedAssigments,

      // MusicLibraryPage
      fetchMyPractices,
      fetchMyPracticesTime,
      // ProfilePage
      fetchJoinedClasses
    ];
    if (!this.props.route.hasOwnProperty("allowFetchUserData")) {
      _allDataFetches.unshift(fetchUserData);
    } else {
      delete this.props.route.allowFetchUserData;
    }


    AsyncStorage.getItem('userId')
    .then((uid) => {
      AsyncStorage.getItem('userEmail').then((email) => {
        // if (uid) {
        //   InteractionManager.runAfterInteractions(() => {
        //     Utils.chainingFetch.call(this, _allDataFetches);
        //   });
        // }

        if (!uid && !email && !this.props.route.unauthorized) {
          this.props.navigator.resetTo({id: 'welcome', unauthorized: true});
          // console.warn('WELCOME!!!!');
        } else {
          // console.warn('HOMEPAGE!!!!');
          if (!this.props.route.nologin) {
            Analytics.login(email);
          }

          InteractionManager.runAfterInteractions(() => {
            Utils.chainingFetch.call(this, _allDataFetches);
          });
        }
        SplashScreen.hide();
      });
    });

    //  AsyncStorage.getItem('userId').then((uid) => {
    //   // this.setState({ready: true});

    //   AsyncStorage.getItem('userEmail').then((email) => {
    //     // console.warn(email, ' / ', (!uid && !email && !this.props.route.unauthorized), ' / ', (email === null));
    //     // if (!uid && !(email === null) && !this.props.route.unauthorized) {
    //     //   this.props.navigator.resetTo({id: 'welcome', unauthorized: true});
    //     //   console.warn('WELCOME!!!!');
    //     // } else {
    //     //   Analytics.login(email); console.warn('HOMEPAGE!!!!');
    //     // }
    //     // this.setState({ready: true});
    //     if (uid === null || uid === '') {
    //       this.props.navigator.resetTo({id: 'welcome', unauthorized: true});
    //       console.warn('WELCOME!!!!');
    //     } else {
    //       console.warn('HOMEPAGE!!!!');
    //     }
    //     console.warn(`email: ${email} uid: ${uid}`);
    //   });
    // });
  }

  goToProfile() {
    if (this.props.assignments.list.length || this.props.assignments.completed.length) {
      this.refs.tabView.goToPage(5);
    } else {
      this.refs.tabView.goToPage(4);
    }
  }

  goToPractice() {
    if (this.props.assignments.list.length || this.props.assignments.completed.length) {
      this.refs.tabView.goToPage(3);
    } else {
      this.refs.tabView.goToPage(2);
    }
  }

  tabChange = ({i: index} = context) => {
    let { tabHistory, PAGES } = this.state;
    let prevPage = 0;

    // console.warn(this.state.PAGES[index]);
    // Analytics.view(this.state.PAGES[index]);
    if (tabHistory.length === 1) {
      tabHistory.push(PAGES[index]);
      this.setState({ tabHistory });

      return;
    }

    tabHistory.shift();
    tabHistory.push(PAGES[index]);
    this.setState({ tabHistory });

    if (tabHistory[prevPage] === 'Practice') {
      this.practicePage.stopTimer();
    }
  }

  render() {
    return (
      <ScrollableTabView
        scrollWithoutAnimation={true}
        ref="tabView"
        tabBarPosition="bottom"
        renderTabBar={ () => <Navigation /> }
        onChangeTab={ this.tabChange }
        initialPage={ 0 }
        >
          <HomePage
            {...this.props}
            goToProfile={ this.goToProfile.bind(this) }
            goToPractice={ this.goToPractice.bind(this) }
          />
          <HomeWorkPage {...this.props} />
          <PracticePage
            ref={ ref => this.practicePage = ref }
            {...this.props}
            refTabView={this.refs.tabView}
            practicesTime={this.props.practice.practiceTime}
          />
          <MusicLibraryPage
            {...this.props}
            refTabView={this.refs.tabView}
            refPractice={ this.practicePage }
          />
          <ProfilePage {...this.props} />
      </ScrollableTabView>
    );
  }
}

function props(state){
  return {
    assignments: state.assignments,
    user: state.user,
    practice: state.practice,
  };
}

export default connect(props)(MainPage);
