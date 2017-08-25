import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
  ActionSheetIOS,
  Alert,
  StatusBar,
  Platform
} from 'react-native';

import { baseStyles, secondColor } from '../../components/styles';
import { connect } from 'react-redux';

import RefreshControl from '../../components/common/refreshControl';
import SimpleListBlock from '../../components/common/listBlock';

import ProfileInfoBlock from '../../components/settings/profileInfoBlock';
import InviteParentsModal from '../../components/settings/inviteParentsModal';
import SendTeacherMessageModal from '../../components/settings/sendTeacherQuestionModal';
import Analytics from '../../services/mixpanelAnalytics';

import {
  fetchJoinedClasses,
  teachersClassLeave,
  sendTeacherQuestion
} from '../../redux/actions/classes';

import {
  fetchMyPracticeAchievements,
  fetchMyPieceAchievements
} from '../../redux/actions/practice';

import Icon from 'react-native-vector-icons/Entypo';

var BUTTONS = [
  'Send Teacher a Question',
  'Leave Class',
  'Cancel'
];
var CANCEL_INDEX = 2;

class ProfilePage extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsVisible: false,
      sendMessageModalIsVisible: false,
      achievementsFetched: false,
    };

    this.title = 'Settings';
    this.isFirst = true;
  }

  componentWillMount() {
    this.props.dispatch(fetchMyPracticeAchievements(
      () => this.props.dispatch(fetchMyPieceAchievements(() => this.setState({ achievementsFetched: true }), () => {} )),
      () => {}
    ));
  }

  componentDidMount() {
    this._onRefresh(true);

    Analytics.view(this.title);
  }

  _onRefresh(isFirst = false) {
    this.isFirst = isFirst;
    this.props.dispatch(fetchJoinedClasses());
  }

  handlePress(data) {
    console.warn('!!!!handlePress', data);
    this.setState({chosenClass: data});
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: data.name,
      }, (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this._setMessageModalVisible(true, data);
          break;
          case 1:
            this.props.dispatch(teachersClassLeave(data));
          break;
          case 2:
            this.setState({
              chosenClass: {}
            });
          break;
          default:
        }
      });
    } else {
      Alert.alert(data.name, null, [
        {
          text: 'Send Teacher a Question',
          onPress: () => {
            this._setMessageModalVisible(true, data);
          }
        },
        {
          text: 'Leave Class',
          onPress: () => {
            this.props.dispatch(teachersClassLeave(data));
          }
        },
        {
          text: 'Cancel',
          onPress: () => {
            this.setState({
              chosenClass: {}
            });
          }
        }
      ]);
    }
  }

  joinNewClass() {
    this.props.navigator.push({id: 'joinNewClass'});
  }

  _setModalVisible(visible) {
    this.setState({modalIsVisible: visible});
  }

  _setMessageModalVisible(visible) {
    this.setState({sendMessageModalIsVisible: visible});
  }

  handleEditPress() {
    this.props.navigator.push({id: 'profileEdit'});
  }

  onSubmitMessage(data) {
    console.warn('onSubmitMessage');
    // if (!this.state.chosenClass) {
    //   return;
    // }

    let _data = {
      // name: this.state.chosenClass.name,
      feedback_type: 'question',
      ...data
    };
    this.props.dispatch(sendTeacherQuestion(1111, _data));
  }

  render() {
    // console.log('profile', this.state.achievementsFetched, this.props.practice);
    return (
      <View style={baseStyles.container}>
       <StatusBar backgroundColor={secondColor} animated barStyle="light-content" />
        <ProfileInfoBlock
          handleEditPress={ this.handleEditPress.bind(this) }
          {...this.props.user}
        />
        <ScrollView
          keyboardShouldPersistTaps
          style={[baseStyles.content, baseStyles.contentL, styles.scrollViewContent]}
          refreshControl={
            <RefreshControl
              refreshing={this.isFirst && this.props.classes.status === 'fetching'}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <SimpleListBlock wrap light title="achievements earned"
            //list={this.props.classes.joinedClasses}
            achievements={(this.state.achievementsFetched) ? this.props.practice.practiceAchievements.concat(this.props.practice.pieceAchievements) : null }
            onPress={this.handlePress.bind(this)}
            emptyText="No achievements"
          />
          {
            <SimpleListBlock light title="classes joined"
              status={this.props.classes.status}
              list={this.props.classes.joinedClasses}
              onPress={this.handlePress.bind(this)}
              titleLink={'+ join new class'}
              onTitleLinkPress={this.joinNewClass.bind(this)}
              emptyText="No classes joined yet"
            />
          }
          <SimpleListBlock light title="invite parents"
            //status={this.props.classes.status}
            list={this.props.classes.joinedClasses}
            //onPress={this.handlePress.bind(this)}
            titleLink={'+ invite parents'}
            onTitleLinkPress={ this._setModalVisible.bind(this, true) }
            emptyText="No invites"
          />
{/*          <View style={[baseStyles.centeredContainer, {paddingTop: 50, paddingBottom: 20}]}>
            <TouchableOpacity
              style={ baseStyles.buttonWithIcon }
              onPress={ this._setModalVisible.bind(this, true) }>
              <Icon style={{marginTop: 5, marginRight: 10}} size={ 28 } name="chevron-thin-up" resizeMode={'contain'} color="#2698d0" />
              <Text style={ [baseStyles.text, baseStyles.linkL, styles.modalShowText, baseStyles.textThinPlatform,
                { fontWeight: (Platform.OS === 'android') ? 'bold' : '400', fontSize: 17}] }>
                Invite Parents to Watch Progress
              </Text>
            </TouchableOpacity>
          </View>*/}
        </ScrollView>
{/*        <Modal
          visible={ this.state.modalIsVisible }
          transparent={ true }
          animationType="slide"
          onRequestClose={ this._setModalVisible.bind(this, false) }>
          <View style={styles.viewModal}>
            <InviteParentsModal
              onClose={ this._setModalVisible.bind(this, false) }
              {...this.props.practice} />
          </View>
        </Modal>*/}

        <Modal
          visible={ this.state.sendMessageModalIsVisible }
          transparent={ true }
          onRequestClose={ this._setMessageModalVisible.bind(this, false) }>
          <View style={styles.viewModal}>
            <SendTeacherMessageModal
              onSubmitHandler={ this.onSubmitMessage.bind(this) }
              onClose={ this._setMessageModalVisible.bind(this, false) } />
          </View>
        </Modal>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  modalShowText: {
    fontSize: 20
  },
  viewModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scrollViewContent: {
    backgroundColor: '#efeff4',
  },
});

function props(state) {
  return {
    user: state.user,
    classes: state.classes,
    practice: state.practice,
  };
}

export default connect(props)(ProfilePage);
