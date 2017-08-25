import React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Slider,
  Vibration,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
  Dimensions,
  StyleSheet,
  Modal,
  StatusBar,
  Platform
} from 'react-native';

import { baseStyles, baseColor, secondColor } from '../../components/styles';
import { connect } from 'react-redux';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import DropdownAlert from 'react-native-dropdownalert';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import PracticeTypesModal from '../../components/practice/practiceTypesModal';
import Icon from 'react-native-vector-icons/Entypo';
import { fetchMyPractices } from '../../redux/actions/practice';
import AddNewModal from '../../components/practice/addNewModal';
import LinearGradient from 'react-native-linear-gradient';
import Analytics from '../../services/mixpanelAnalytics';
import MetronomeSettings from '../addPractice/metronomeSettings';
import {
  submitPracticeTime,
  subscribePracticeAssignment,
  submitFreePracticeTime,
  subscribePracticePiece
} from '../../redux/actions/practice';

let { height, width } = Dimensions.get('window');

import { keepAwake } from '../../redux/actions/practice';

import BCGTimer from 'react-native-bcg-timer';


class PracticePage extends React.Component {
  constructor() {
    super();

    this.practice = {};
    this.maxLength = 60;
    this.title = 'Practice';
    this.state = {
      ...this.getWindowSizes(),
      modalIsVisible: false,
      addNewPracticeIsVisible: false,
      bpmValue: 90,
      timerIsRunning: false,
      first: true,
      time: 0,
      fill: 0,
      freePractice: true,
      title: null,
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    Analytics.view(this.title);

    let { args } = this.props.route;

    if (args) {
      if (!this.getPracticeFromHistory(args.pieceUrl)) {
        this._subscribeOnPractice(args);
      }
      this.setState({ title: args.title });
      InteractionManager.runAfterInteractions(() => {
        this.toggleTimer();
      });
    }

    console.log('this.propsPractice', this.props.route, this.practice);
    // BackAndroid.addEventListener('backAndroidHandlerPractice', Utils.backAndroidHandlerPractice.bind(this));

  }

  setupPractice = (args) => {
    // console.log('ARGSARGS', args);
    const isSelectedPiece = args && this.practice.piece === args.pieceUrl;
    const time = Math.round(this.state.time / 60);

    switch (true) {
      case !args && this.state.first:
        // console.log('CASE__1');
        return; // RETURN

      case !args && !this.state.first:
      case isSelectedPiece:
        // console.log('CASE__2');
        this.toggleTimer();
        return; // RETURN

      case !this.practice.id && !this.state.first:
        // console.log('CASE__3', this.practice);
        this.props.dispatch(submitFreePracticeTime(
          { duration: time },
          () => this.dropdown.alert('custom', 'Success', 'Saved!'),
          () => Alert.alert('Practice Submit Failed', 'We are sorry, but something went wrong')
        ));
        break;

      case !!this.practice.id:
        // console.log('CASE__4', this.practice);
        this.practice.duration = this.practice.duration + time;
        this.props.dispatch(submitPracticeTime(
          this.practice,
          () => this.dropdown.alert('custom', 'Success', 'Saved!'),
          () => Alert.alert('Practice Submit Failed', 'We are sorry, but something went wrong')
        ));
        break;
    }

    this.setState({
      time: 0,
      fill: 0,
      title: args.title,
    });

    // this._subscribePractice(args);

    let isPiecePracticed = this.getPracticeFromHistory(args.pieceUrl);

    if (!isPiecePracticed.length) {
      this._subscribePractice(args);
    } else {
      this.practice = isPiecePracticed[0];
    }

    InteractionManager.runAfterInteractions(() => {
      this.toggleTimer();
    });
  };

  _subscribePractice(args) {
    if (args.type === 'assignment') {
      this.props.dispatch(subscribePracticeAssignment(
        args.pieceUrl,
        res => this.practice = res
      ));
    } else if (args.type === 'piece') {
      this.props.dispatch(subscribePracticePiece(
        args.pieceUrl,
        res => this.practice = res
      ));
    }
  }

  componentWillUnmount() {
    this.stopTimer();
    // BackAndroid.removeEventListener('backAndroidHandlerPractice', Utils.backAndroidHandlerPractice.bind(this));
  }

  _getSize() {
    return Math.min(this.state.width, this.state.height) / 1.5;
  }

  getWindowSizes() {
    return { ...Dimensions.get('window') };
  }

  onLayout = () => {
    this.setState({ ...this.getWindowSizes() });
  };

  _buttonSize() {
    let width, height;
    width = height = Math.min(this.state.width, this.state.height) / 1.5;
    // For horizontal rotation
    //
    // if (height > (this.state.height / 2) ) {
    //   width = height = Math.min(this.state.width, this.state.height) / 2;
    // }
    return {
      width,
      height
    };
  }

  toggleTimer = () => {
    Vibration.vibrate(100);


    if (this.state.timerIsRunning) {
      // BCGTimer.changeStatus(false);
      Analytics.practicePause();
    } else {
      BCGTimer.changeStatus(true);
      if (!this.state.first) {
        Analytics.practiceResume();
      } else {
        this.setState({ first: false });
      }
    }

    this.setState({ timerIsRunning: !this.state.timerIsRunning } , () => {
      // console.log('TIMER__TIMER', this.state.timerIsRunning);
      (this.state.timerIsRunning) ? this.tick() : this.stopTimer();
    });
  };

  tick = () => {
    let _fill = (((this.state.time + 1) % this.maxLength) * 100) / this.maxLength;
    BackgroundTimer.clearTimeout(this.timer);

    this.setState({
      time: this.state.time + 1,
      fill: _fill
    });

    this.timer = BackgroundTimer.setTimeout(this.tick, 1000);

    return this.timer;
  };

  stopTimer = () => {
    BackgroundTimer.clearTimeout(this.timer);
    this.setState({ timerIsRunning: false });
  };

  getPracticeFromHistory = (pieceUrl) => {
    let { practiceTime } = this.props.practice;
    let practiceFromHistory = practiceTime.filter(practice => practice.piece === pieceUrl);

    return practiceFromHistory;
  };

  _startPractice = () => {
    Analytics.practiceStart();

    const isFreePracticed = this.getPracticeFromHistory(null);
    if (isFreePracticed.length) {
      this.practice = isFreePracticed[0];
    }

    this.toggleTimer();
  };

  submitPractice() {
    console.log('submitPractice', this.practice);

    BCGTimer.changeStatus(false);

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

    // console.log('practiceeeee1', this.practice);
    this.props.dispatch(submitPracticeTime(this.practice,
      successCB.bind(this),
      () => Alert.alert('Practice Submit Failed', 'We are sorry, but something went wrong')
    ));
  }

  _setModalVisible(visible) {
    this.setState({modalIsVisible: visible});
  }

  _setAddNewModalVisible(visible) {
    this.setState({addNewPracticeIsVisible: visible});
  }

  setCurrentPractice(data) {
    Analytics.practiceStart();
    let args = {
      name: data.title,
      type: 'piece',
      data
    };

    this._setModalVisible(false);
    this.props.navigator.push({id: 'practiceLesson', args});
  }

  addNewPractice = () => {
    // this._setModalVisible(false);
    this.props.navigator.push({
      id: 'addPracticePage',
      title: 'What are you practicing?',
      refTabView: this.props.refTabView,
      onSuccessCb: () => {
        this._onRefresh();
        this.setupPractice();
      },
      setupPractice: this.setupPractice,
    });
    this.stopTimer();
  };

  _onRefresh() {
    //this.isFirst = isFirst;
    // this.props.dispatch(fetchMyPracticesTime());
  }

  render() {
    if (this.props.practice) {
      // console.log('LIST', this.props.practice);
    }
    // console.log('LIST', this.props.practice);
    let playerIcon = this.state.timerIsRunning ? (
        <Icon name="controller-paus" size={ 37 } resizeMode={'contain'} color="#fff" />
      ) : (
        <Icon name="controller-play" size={ 37 } resizeMode={'contain'} color="#fff" />
      );
      let { practiceTime } = this.props.practice;
    return (
      this.props.practice.practiceTimeStatus === 'fetched'
        ?
          <View style={ baseStyles.container } onLayout={ this.onLayout }>
            <StatusBar backgroundColor={secondColor} animated={true} barStyle="light-content" />
            {/*<PageTitle title={ this.title } />*/}
            <LinearGradient colors={[ '#2699d3', '#33a0d6', '#28a0dc' ]} style={{ flex: 1 }}>
              <View style={[ baseStyles.centeredContainer, { flex: 0.6, marginTop: 35, justifyContent: 'center' } ]}>
                {
                  !this.state.first
                    ? <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity
                          style={[ styles.timer , { width: this._getSize(), height: this._getSize(), }]}
                          onPress={ this.toggleTimer }
                        >
                          <AnimatedCircularProgress
                            rotation={ 0 }
                            size={ this._getSize() }
                            width={ 4 }
                            fill={ this.state.fill }
                            tension={ 1000 }
                            friction={ 30 }
                            tintColor={ '#fff' }
                            backgroundColor={ '#5cb7e4' }
                          >
                            { fill => (
                              <View style={ [baseStyles.centeredContainer, styles.progressInnerView, {width: this._getSize(), height: this._getSize(), marginTop: -1 * this._getSize()}] }>
                                <Text style={ [baseStyles.textLightPlatform,styles.progressText, {marginTop: 38,paddingBottom: 20, fontSize: 54}] }>{ moment.utc(this.state.time * 1000).format('mm:ss') }</Text>
                                { playerIcon }
                              </View>
                            )}
                          </AnimatedCircularProgress>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={ this.submitPractice.bind(this) }
                          style={[ styles.submitButton, {
                            width: width / 3,
                            alignItems:'center',
                            justifyContent: 'center'
                          }]}
                        >
                          <Text style={ [baseStyles.textThinPlatform,styles.submitButtonText, {
                              fontSize: 19,
                              fontWeight: (Platform.OS === 'android') ? 'bold' : '400'
                            }] }>Done</Text>
                        </TouchableOpacity>
                      </View>

                    : <TouchableOpacity
                        style={[ styles.startButton, baseStyles.centeredContainer, {
                          ...this._buttonSize(),
                           borderRadius: this._buttonSize().width
                        }]}
                        onPress={ this._startPractice }
                      >
                      <Text style={[ baseStyles.textThinPlatform, styles.startButtonText, { fontSize: 50,fontWeight: (Platform.OS === "android") ? 'bold': '400', backgroundColor: 'rgba(0,0,0,0)' }]}>Start</Text>
                    </TouchableOpacity>
                }

              </View>
              {/*<View style={ [baseStyles.centeredContainer, {flex: 0.2}] }>
                <TouchableOpacity
                  style={ baseStyles.buttonWithIcon }
                  onPress={ this._setModalVisible.bind(this, true) }>
                  <Icon style={{marginTop: 5, marginRight: 10, backgroundColor: 'rgba(0,0,0,0)'}} size={ 30 } name="chevron-thin-up" resizeMode={'contain'} color="#fff" />
                  <Text style={ [baseStyles.textThinPlatform,baseStyles.text, styles.modalShowText, {  fontWeight: '400',backgroundColor: 'rgba(0,0,0,0)',fontSize: 19}] }>What are you practicing?</Text>
                </TouchableOpacity>
              </View>*/}
              <View style={{ flex: 0.4, justifyContent: 'flex-end' }}>
                <MetronomeSettings
                  addNewPractice={ this.addNewPractice }
                  onStart={ this.state.first }
                  practicingTitle={ this.state.title }
                />
              </View>

              <DropdownAlert
                ref={ref => this.dropdown = ref}
                closeInterval={2000}
                titleStyle={baseStyles.text}
                messageStyle={baseStyles.text}
              />
              <Modal
                visible={ this.state.modalIsVisible }
                transparent={ true }
                animationType="slide"
                onRequestClose={ this._setModalVisible.bind(this, false) }>

                <View style={{flex:1,backgroundColor: 'rgba(0,0,0,0.4)'}}>
                 <PracticeTypesModal
                  handlePracticeSelect={ this.setCurrentPractice.bind(this) }
                  // onAddNew={ this._setAddNewModalVisible.bind(this, true) }
                  onAddNew={ this.addNewPractice.bind(this, true) }
                  onClose={ this._setModalVisible.bind(this, false) }
                  {...this.props.practice} />
                </View>

                <Modal
                  transparent={ true }
                  visible={ this.state.addNewPracticeIsVisible }
                  //onRequestClose={ this._setAddNewModalVisible.bind(this, false) }
                  onRequestClose={ this._setAddNewModalVisible.bind(this, false) }>
                  <AddNewModal
                    onClose={ this._setAddNewModalVisible.bind(this, false) } />
                </Modal>

              </Modal>
            </LinearGradient>
          </View>
        :
          <ActivityIndicator
            size="large"
            style={{ flex: 1 }}
          />
    );
  }
}

let styles = StyleSheet.create({
  timer: {
    // marginBottom: 30,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  startButton: {
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'white'
  },
  startButtonText: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold'
  },
  modalShowText: {
    fontSize: 20
  },
  progressText: {
    fontSize: 50,
    color: 'white'
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#4eceb7'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 24
  },
});

function props(state) {
  return {
    practice: state.practice
  };
}

export default PracticePage;
