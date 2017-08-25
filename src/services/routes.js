import React from 'react';
import {
  AsyncStorage,
  BackAndroid
} from 'react-native';

import Utils from '../services/utils';
// import BackAndroid from '../services/backAndroid';

import PracticeLessonPage from '../pages/practiceLesson/page';
import AddPracticePage from '../pages/addPractice/page';
import AddPiecePage from '../pages/addPiece/page';
import LoginPage from '../pages/authorize/login';
import RegisterPage from '../pages/authorize/register';
import MainPage from '../pages/main/page';
import WelcomePage from '../pages/authorize/welcome';
import JoinNewClassPage from '../pages/joinNewClass/page';
import SettingsEditPage from '../pages/settings/edit';
import SeeAllMusicLibraryPage from '../pages/musicLibrary/seeAll';
import CustomPiecePage from '../pages/customPiece/page';
import SingleCommentsPage from '../pages/customPiece/singleComments';
import AskQuestion from '../pages/customPiece/askQuestion';
import SeeAllPage from '../pages/customPiece/seeAll';

import Analytics from './mixpanelAnalytics';

class Routes extends React.Component {
  constructor() {
    super();

    this.state = { ready: false };
  }

  componentDidMount() {
    this.setState({ ready: true });

    BackAndroid.addEventListener('hardwareBackPress', Utils.backAndroidHandler.bind(this));
  }

  render() {
    if (this.state.ready) {
      switch (this.props.route.id) {
        case 'seeAllMusicLibrary':
          return (
            <SeeAllMusicLibraryPage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'welcome':
          return (
            <WelcomePage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'login':
          return (
            <LoginPage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'register':
          return (
            <RegisterPage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'main':
          return (
            <MainPage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'practiceLesson':
          return (
            <PracticeLessonPage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'addPracticePage':
          return (
            <AddPracticePage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'addPiecePage':
          return (
            <AddPiecePage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'joinNewClass':
          return (
            <JoinNewClassPage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'profileEdit':
          return (
            <SettingsEditPage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'customPiece':
          return (
            <CustomPiecePage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'singleComments':
          return (
            <SingleCommentsPage navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'askQuestion':
          return (
            <AskQuestion navigator={ this.props.navigator } route={ this.props.route } />
          );
        case 'seeAll':
          return (
            <SeeAllPage navigator={ this.props.navigator } route={ this.props.route } />
          );
      }
    } else {
      return null;
    }
  }
}

export default Routes;
