import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
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

import Icon from 'react-native-vector-icons/Entypo';

class ProfilePage extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsVisible: false,
      sendMessageModalIsVisible: false
    };

    this.isFirst = true;
  }

  componentDidMount() {
    this._onRefresh(true);

    Analytics.view('Settings Page');
  }

  _onRefresh(isFirst = false) {
    this.isFirst = isFirst;
    this.props.dispatch(fetchJoinedClasses());
  }

  handlePress(data) {
    this.setState({chosenClass: data});

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
    if (!this.state.chosenClass) {
      return;
    }

    let _data = {
      name: this.state.chosenClass.name,
      feedback_type: 'question',
      ...data
    };
    this.props.dispatch(sendTeacherQuestion(this.state.chosenClass.id, _data));
  }

  render() {
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
          <SimpleListBlock light title="classes joined"
            status={this.props.classes.status}
            list={this.props.classes.joinedClasses}
            onPress={this.handlePress.bind(this)}
            titleLink={'+ join new class'}
            onTitleLinkPress={this.joinNewClass.bind(this)}
            emptyText="No classes joined yet"
          />
          <View style={[baseStyles.centeredContainer, {paddingTop: 50, paddingBottom: 20}]}>
            <TouchableOpacity
              style={ baseStyles.buttonWithIcon }
              onPress={ this._setModalVisible.bind(this, true) }>
              <Icon style={{marginTop: 5, marginRight: 10}} size={ 28 } name="chevron-thin-up" resizeMode={'contain'} color="#2698d0" />
              <Text style={ [baseStyles.text, baseStyles.linkL, styles.modalShowText, baseStyles.textThinPlatform,
                { fontWeight: (Platform.OS === 'android') ? 'bold' : '400', fontSize: 17}] }>
                Invite Parents to Watch Progress
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          visible={ this.state.modalIsVisible }
          transparent={ true }
          animationType="slide"
          onRequestClose={ this._setModalVisible.bind(this, false) }>
          <View style={styles.viewModal}>
            <InviteParentsModal
              onClose={ this._setModalVisible.bind(this, false) }
              {...this.props.practice} />
          </View>
        </Modal>

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
    classes: state.classes
  };
}

export default connect(props)(ProfilePage);
