import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  Modal,
  Vibration,
  StatusBar,
  Alert,
  Platform,
  BackAndroid,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import {baseStyles, secondColor} from '../../components/styles';
import PageTitle from '../../components/common/pageTitle';
import moment from 'moment';
import Utils from '../../services/utils';
import BackgroundTimer from 'react-native-background-timer';

import PracticeTypesModal from '../../components/practice/practiceTypesModal';
import AddNewModal from '../../components/practice/addNewModal';
import MetronomeSettings from '../addPractice/metronomeSettings';

import {connect} from 'react-redux';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Entypo';

import { keepAwake } from '../../redux/actions/practice';
import Analytics from '../../services/mixpanelAnalytics';

import {
  fetchAssigments,
  fetchCompletedAssigments
} from '../../redux/actions/assignments';
import {fetchProgressChartData} from '../../redux/actions/progressChart';
import LinearGradient from 'react-native-linear-gradient';
var width = Dimensions.get('window').width;

import {
  submitPracticeTime,
  subscribePracticeAssignment,
  submitFreePracticeTime,
  subscribePracticePiece
} from '../../redux/actions/practice';

class PracticeLessonPage extends React.Component {
  constructor() {
    super();

    this.maxLength = 60;

    this.practice = {};

    this.state = {
      title: 'Practice',
      ...this._getWindowSizes(),
      timerIsRunning: false,
      time: 0,
      fill: 0,
      modalIsVisible: false,
      addNewPracticeIsVisible: false,
      freePractice: true,
      showtoast: false,
      first: true,
    };
  }

  _getWindowSizes() {
    return {...Dimensions.get('window')};
  }

  _getSize() {
    return Math.min(this.state.width, this.state.height) / 1.5;
  }

  goBack() {
    this.props.navigator.pop();
  }

  componentDidMount() {
    // BackAndroid.removeEventListener('hardwareBackPress', Utils.backAndroidHandler.bind(this));


    this.props.dispatch(keepAwake());
    if (this.props.route.args.type === 'assignment') {
      this.props.dispatch(subscribePracticeAssignment(this.props.route.args.url,
        (res) => {
          this.practice = res;
        }
      ));
    } else if (this.props.route.args.type === 'piece') {
      this.props.dispatch(subscribePracticePiece(this.props.route.args.url,
        (res) => {
          this.practice = res;
        }
      ));
    }
    this._setPracticeTitle(this.props.route.args);
    InteractionManager.runAfterInteractions(() => {
      this.toggleTimer();
    });

    // console.log('Title:' + this.props.route.args.name);
    if (this.props.route.args.name === 'Free Practice') {
      this.setState({freePractice: true});
    } else {
      this.setState({freePractice: false});
    }


    // BackAndroid.addEventListener('backAndroidHandlerPractice', Utils.backAndroidHandlerPractice.bind(this));
  }


  _setPracticeTitle(data) {
    this.setState({
      title: (data.name || data.title)
    });
  }

  setCurrentPractice(data) {
    this.practice.piece = data.url;
    if (this.practice.assignment) {
      this.practice.assignment = null;
    }
    this._setPracticeTitle(data);
    //this.stopTimer();
    this.setState({freePractice: false});
    // this.setState({
    //   time: 0,
    //   fill: 0
    // });
    this._setModalVisible(false);
  }

  componentWillUnmount() {
    this.stopTimer();
    // BackAndroid.removeEventListener('backAndroidHandlerPractice', Utils.backAndroidHandlerPractice.bind(this));
  }

  tick() {
    let _fill = (((this.state.time + 1) % this.maxLength) * 100) / this.maxLength;
    BackgroundTimer.clearTimeout(this.timer);

    this.setState({
      time: this.state.time + 1,
      fill: _fill
    });

    this.timer = BackgroundTimer.setTimeout(this.tick.bind(this), 1000);

    return this.timer;
  }

  stopTimer() {
    BackgroundTimer.clearTimeout(this.timer);
    this.setState({timerIsRunning: false});
  }

  toggleTimer() {
    Vibration.vibrate(100);


    if (this.state.timerIsRunning) {
      Analytics.practicePause();
    } else {
      if (!this.state.first) {
        Analytics.practiceResume();
      } else {
        this.setState({ first: false });
      }
    }

    this.setState({ timerIsRunning: !this.state.timerIsRunning}, () => {
      // console.log('TIMER__TIMER', this.state.timerIsRunning);
      (this.state.timerIsRunning) ? this.tick() : this.stopTimer();
    });

  }

  _fetchAllProgress() {
    InteractionManager.runAfterInteractions(() => {
      Utils.chainingFetch.call(this, [
        fetchAssigments,
        fetchCompletedAssigments,
        fetchProgressChartData
      ]);
    });
  }

  submitPractice() {
    const time = Math.round(this.state.time / 60);
    let successCB = () => {
      const alert_time = (time <= 1)
        ?
          'Saved!'
        :
          `Nice job, you added ${time} minutes!`;
      let args = {
        id: 'main',
        nologin: true,
        alert: {
          type: 'custom',
          holder: 'Success',
          name: alert_time,
        },
        allowFetchUserData: false,
      };
      this.props.dispatch(keepAwake());
      // this.props.navigator.push(args);
      Analytics.practiceEnd();
      this.props.navigator.resetTo(args);
      this._fetchAllProgress();
    };
    if (!this.practice.id) {
      this.props.dispatch(submitFreePracticeTime({
        duration: time
      }, successCB.bind(this)));
      return;
    }

    this.practice.duration = this.practice.duration + time;

    // console.log('practiceeeee2', this.practice);
    this.props.dispatch(submitPracticeTime(this.practice,
      successCB.bind(this),
      () => Alert.alert('Practice Submit Failed', 'We are sorry, but something went wrong')
    ));
  }

  checkTimer(is = true) {
    if (this.state.timerIsRunning === is) {
      this.toggleTimer();
    }
  }

  _setModalVisible(visible) {
    if (visible) {
      this.checkTimer();
    } else {
      this.checkTimer(false);
    }

    this.setState({modalIsVisible: visible});
  }

  _setAddNewModalVisible(visible) {
    this.setState({addNewPracticeIsVisible: visible});
  }

  _alertCancel = () => {
    // this.toggleTimer();
  }

  _alertOk = () => {
    // this.submitPractice();

    Analytics.practiceEnd();
    this.props.navigator.resetTo({
      id: 'main',
      allowFetchUserData: false,
      nologin: true,
    });
  };

  addNewPractice = () => {
    // this._setModalVisible(false);
    this.props.navigator.push({
      id: 'addPracticePage',
      title: 'What are you practicing?',
      onSuccessCb: () => {},
    });
  };

  _alertMessage() {
    Alert.alert(
      'Warning',
      'Do you want to exit this session without saving your time?',
      [
        {
          text: 'Cancel',
          onPress: this._alertCancel,
        },
        {
          text: 'OK',
          onPress: this._alertOk,
        },
      ]
    );
  }

  goBack() {
    //this.toggleTimer();
    this._alertMessage();
  }

  render() {
    console.log('PRACTICE', this.practice);
    let Mod =
     this.state.freePractice ?
    (
      <MetronomeSettings
        addNewPractice={ this.addNewPractice }
      />
      /*<TouchableOpacity
        style={ baseStyles.buttonWithIcon }
        onPress={ this._setModalVisible.bind(this, true) }>
        <Icon style={{marginTop: 5, marginRight: 10}} size={ 30 } name="chevron-thin-up" resizeMode={'contain'} color="#fff" />
        <Text style={ [baseStyles.textThinPlatform,
                       baseStyles.text,
                       styles.modalShowText, {
                        fontWeight: '400',
                        fontSize: 19}
                      ] }>Type what are you practicing?</Text>
      </TouchableOpacity>*/
    )
    :
    (
      <TouchableOpacity
        style={ baseStyles.buttonWithIcon }
        onPress={ this._setModalVisible.bind(this, true) }>
        <Icon style={{marginTop: 5, marginRight: 10}} size={ 30 } name="chevron-thin-up" resizeMode={'contain'} color="#fff" />
      </TouchableOpacity>
    );

    let playerIcon = this.state.timerIsRunning ? (
      <Icon name="controller-paus" size={ 37 } resizeMode={'contain'} color="#fff" />
    ) : (
      <Icon name="controller-play" size={ 37 } resizeMode={'contain'} color="#fff" />
    );

    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={secondColor} animated={true} barStyle="light-content" />
        <PageTitle
          title={ this.state.title }
          iconLeft="chevron-left"
          onLeftButton={this.goBack.bind(this)}
          leftButtonText="Back"
        />

        <LinearGradient colors={['#2699d3', '#33a0d6', '#28a0dc']} style={{flex: 1}}>
          <View style={ [baseStyles.centeredContainer, {flex: 0.6}] }>
            <TouchableOpacity
              style={ {width: this._getSize(), height: this._getSize()} }
              onPress={ this.toggleTimer.bind(this) }>
              <AnimatedCircularProgress
                rotation={ 0 }
                size={ this._getSize() }
                width={4}
                fill={this.state.fill}
                tension={ 1000 }
                friction={ 30 }
                tintColor="#fff"
                backgroundColor="#5cb7e4">
                {(fill) => (
                  <View style={ [baseStyles.centeredContainer, styles.progressInnerView, {width: this._getSize(), height: this._getSize(), marginTop: -1 * this._getSize()}] }>
                  <Text style={ [baseStyles.textLightPlatform,styles.progressText, {marginTop: 38,paddingBottom: 20, fontSize: 54}] }>{ moment.utc(this.state.time * 1000).format('mm:ss') }</Text>
                  { playerIcon }
                  </View>
                )}
              </AnimatedCircularProgress>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={ this.submitPractice.bind(this) }
              style={ [styles.submitButton, {
                width: width / 3,
                alignItems:'center',
                justifyContent: 'center'
              }] }>
              <Text style={ [baseStyles.textThinPlatform,styles.submitButtonText, {
                fontSize: 19,
                fontWeight: (Platform.OS === 'android') ? 'bold' : '400'
              }] }>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.4, justifyContent: 'flex-end' }}>
            { Mod }
          </View>

          <Modal
            visible={ this.state.modalIsVisible }
            transparent
            animationType="slide"
            onRequestClose={ this._setModalVisible.bind(this, false) }>

            <View style={{flex:1,backgroundColor: 'rgba(0,0,0,0.4)'}}>
             <PracticeTypesModal
              handlePracticeSelect={ this.setCurrentPractice.bind(this) }
              onAddNew={ this._setAddNewModalVisible.bind(this, true) }
              onClose={ this._setModalVisible.bind(this, false) }
              {...this.props.practice} />
            </View>
            <Modal
              transparent
              visible={ this.state.addNewPracticeIsVisible }
              onRequestClose={ this._setAddNewModalVisible.bind(this, false) }>
              <AddNewModal
                onClose={ this._setAddNewModalVisible.bind(this, false) } />
            </Modal>
          </Modal>
        </LinearGradient>
        { this.props.practice.awake ? <KeepAwake /> : undefined }
      </View>
    );
  }
}

let styles = StyleSheet.create({
  progressInnerView: {
    position: 'absolute'
  },
  progressText: {
    fontSize: 50,
    color: 'white'
  },
  submitButton: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#4eceb7'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 24
  },
  modalShowText: {
    fontSize: 20
  }
});

function props(state) {
  return {
    practice: state.practice
  };
}

export default connect(props)(PracticeLessonPage);
