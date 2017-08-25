import React from 'react';
import {
  View,
  InteractionManager,
  Modal,
  Alert,
  Text,
} from 'react-native';

import {baseStyles} from '../../components/styles';

import PageTitle from '../../components/common/pageTitle';
import PageSwitcher from '../../components/joinNewClass/pageSwitcher';
import SearchTeacherTab from '../../components/joinNewClass/searchTeacher';
import EnterCodeTab from '../../components/joinNewClass/enterCode';
import SelectTeachersClassModal from '../../components/joinNewClass/selectTeachersClassModal';

import Utils from '../../services/utils';

import {
  fetchTeachersClasses,
  fetchJoinedClasses,
  teachersClassSignUp,
  teachersClassSignUpById
} from '../../redux/actions/classes';

import {connect} from 'react-redux';

class JoinNewClassPage extends React.Component {
  constructor() {
    super();
    this.title = 'Join New Class';

    this.state = {
      activeTab: 0,
      modalIsVisible: false,
      selectedTeacher: {}
    };

    this._signUpSuccess = Utils.debounce(this._signUpSuccess.bind(this), 200);
    this._signUpFailure = Utils.debounce(this._signUpFailure.bind(this), 200);
  }

  changeActiveTab(tabId) {
    this.setState({activeTab: tabId});
  }

  handleTeacherSelect(data) {
    this.setState({
      selectedTeacher: data
    });

    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(fetchTeachersClasses(data.id));
    });

    InteractionManager.runAfterInteractions(() => {
      this._setModalVisible(true);
    });
  }

  _signUpSuccess() {
    Alert.alert('Success!', 'You successfully joined the class');
    this.props.dispatch(fetchJoinedClasses());
  }

  _signUpFailure(err) {
    if (err) {
      Alert.alert('Fail', Utils.parseServerError(err));
    } else {
      Alert.alert('Fail', 'Failed to sign up.');
    }
  }

  handleClassNumberSet(data) {
    let classNumber = data.classNumber.join('');

    if (classNumber.length < 6) {
      Alert.alert('Class Number mismatch', 'Class Number incorrect');
      return;
    }

    this.props.dispatch(teachersClassSignUpById({
      student: this.props.user.url,
      classId: classNumber
    }, this._signUpSuccess, this._signUpFailure));
  }

  handleClassesSignUp(classes) {
    classes.forEach((item) => {
      this.props.dispatch(teachersClassSignUp({
        student: this.props.user.url,
        student_class: item.url
      }, this._signUpSuccess, this._signUpFailure));
    });
  }

  showActiveTab() {
    if (this.state.activeTab === 0) {
      return (<SearchTeacherTab
        handleTeacherSelect={ this.handleTeacherSelect.bind(this) } />);
    } else if (this.state.activeTab === 1) {
      return (<EnterCodeTab
        handleClassNumberSet={this.handleClassNumberSet.bind(this) } />);
    }
    
  }

  _setModalVisible(visible) {
    this.setState({modalIsVisible: visible});
  }

  goBack() {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigator.pop();
    });
  }

  render() {
    return (
      <View style={ baseStyles.container }>
        <PageTitle
          onLeftButton={ this.goBack.bind(this) }
          leftButtonText="Cancel"
          iconLeft="navigate-before"
          title={ this.title } />

        <PageSwitcher
          onChange={ this.changeActiveTab.bind(this) }
          activeTab={ this.state.activeTab }
          tabs={ ['Search', 'Enter Code'] } />

        { this.showActiveTab() }
        <Modal
          visible={ this.state.modalIsVisible }
          transparent={ true }
          animationType="slide"
          onRequestClose={ this._setModalVisible.bind(this, false) }>

          <View style={{flex:1,backgroundColor: 'rgba(0,0,0,0.4)'}}>
            <SelectTeachersClassModal
              onClose={ this._setModalVisible.bind(this, false) }
              classesSignUp={ this.handleClassesSignUp.bind(this) }
              classes={ this.props.classes.teachersClasses }
              { ...this.state.selectedTeacher }
              navigator={ this.props.navigator } />
          </View>

        </Modal>
      </View>
    );
  }
}

function props(state) {
  return {
    user: state.user,
    classes: state.classes
  };
}

export default connect(props)(JoinNewClassPage);
