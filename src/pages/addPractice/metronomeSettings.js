import React from 'react';
import {
  View,
  Text,
  Image,
  Slider,
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native';

import { playSound } from '../../utils/playSound';
import BackgroundTimer from 'react-native-background-timer';

const BPM_MIN = 40;
const BPM_MAX = 218;
const BPM_DEFAULT = 90;
const BPM_STEP = 1;
const PADDING = 20;
const MARGIN = 25;
const ICON_WIDTH = 26;
const INDENTS = (PADDING + MARGIN + ICON_WIDTH) * 2;

class MetronomeSettings extends React.Component {
  constructor() {
    super();

    this.state = {
      bpmValue: 90,
      isExpanded: false,
      isStart: false,
    };
    this.metronome;
  }

  componentWillUpdate = (nextProps, nextState) => {
    // console.log('componentWillUpdate', nextState);
    if (nextState.bpmValue !== this.state.bpmValue && nextState.isStart) {
      // console.warn('THIS', this.state.bpmValue, 'NEW', nextState.bpmValue);
      this.refreshMetronome(nextState.bpmValue);
    }
  }

  refreshMetronome = (bpm) => {
    this.pauseMetronome();
    this.startMetronome(bpm);
  }

  startMetronome(bpm) {
    this.setState({isStart: true});
    // console.warn('startMetronome', bpm);
    let delay = (60 * 1000) / bpm;
    // console.warn('delay', delay);
    this.metronome = BackgroundTimer.setInterval(() => {
      playSound();
    }, delay);
  }

  pauseMetronome = () => {
    this.setState({isStart: false});
    BackgroundTimer.clearInterval(this.metronome);
  }

  _handleExpand = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  _getBPMContainer = () => {
    let { onStart } = this.props;
    let backgroundColor = onStart ? 'rgba(0,0,0,0)' : '#1C76A4';
    let marginBottom = onStart ? 20 : 0;
    let paddingVertical = onStart ? 0 : 10;
    let borderBottomWidth = onStart ? 0 : StyleSheet.hairlineWidth;
    let variableStyles = {
      backgroundColor,
      marginBottom,
      paddingVertical,
      borderBottomWidth,
    };
    let icon = this.state.isExpanded
      ? require('../../../images/contract.png')
      : require('../../../images/expand.png');

    return (
      <View style={[ styles.bpmContainer, { ...variableStyles } ]}>
        <View style={ styles.bpmSubContainer }>
          {
            !this.props.onStart &&
              <TouchableOpacity
                onPress={ this._handleExpand }
                style={ styles.expandIconContainer }
              >
                <Image
                  source={ icon }
                  style={ styles.expandIcon }
                />
              </TouchableOpacity>
          }
          <View style={ styles.bpmValueContainer }>
            <Text style={[ styles.bpm, styles.bpmValue ]}>
              { this.state.bpmValue }
            </Text>
            <Text style={[ styles.bpm, styles.bpmValueText ]}>
              BPM
            </Text>
          </View>
        </View>
        {
          !this.state.isStart ?
          <TouchableOpacity
            onPress={ () => this.startMetronome(this.state.bpmValue) }
          >
            <Image
              source={ require('../../../images/play.png') }
              style={ styles.playIcon }
            />
          </TouchableOpacity> :
          <TouchableOpacity
            onPress={ this.pauseMetronome }
          >
            <Image
              source={ require('../../../images/pause.png') }
              style={ styles.playIcon }
            />
          </TouchableOpacity>
        }
      </View>
    );
  }

  _getPracticingContainer = () => {
    let { onStart } = this.props;
    let backgroundColor = onStart ? '#1C76A4' : 'rgba(0,0,0,0)';
    let color = onStart ? '#8DBAD1' : '#92CDEB';

    return (
      <TouchableOpacity
        style={[ styles.practicingContainer, { backgroundColor } ]}
        onPress={ () => { this.props.addNewPractice() }}
      >
        <Text style={[ styles.practicing, { color } ]}>
          {
            this.props.practicingTitle
              ? this.props.practicingTitle
              : 'Type what are you practicing...'
          }
        </Text>
      </TouchableOpacity>
    );
  }

  _getSlider = () => {
    if (this.state.isExpanded || this.props.onStart) {
      return (
        <View style={ styles.sliderContainer }>
          <TouchableOpacity onPress={ () => (this.state.bpmValue - 1 >= BPM_MIN) &&  this.setState({ bpmValue: this.state.bpmValue - 1 })}>
            <Image
              source={ require('../../../images/minus.png') }
              style={ styles.minusIcon }
            />
          </TouchableOpacity>
          <Slider
            minimumValue={ BPM_MIN }
            maximumValue={ BPM_MAX }
            maximumTrackTintColor={ '#5296B9' }
            minimumTrackTintColor={ '#A8CADC' }
            step={ BPM_STEP }
            onSlidingComplete={ value => this.setState({ bpmValue: value }) }
            /*onValueChange={ value => {
              this.setState({ bpmValue: value });
              // console.log(value);
            }}*/
            value={ this.state.bpmValue }
            style={ styles.slider }
          />
          <TouchableOpacity onPress={ () => (this.state.bpmValue + 1 <= BPM_MAX) &&  this.setState({ bpmValue: this.state.bpmValue + 1 })}>
            <Image
              source={ require('../../../images/plus.png') }
              style={ styles.plusIcon }
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }

  _getTimerIsRunPauseLayout = () => {
    return (
      <View style={{ flex: 1 }}>
        { this._getPracticingContainer() }
        { this._getBPMContainer() }
        { this._getSlider() }
      </View>
    );
  }

  _getTimerOnStartLayout = () => {
    return (
      <View style={{ flex: 1 }}>
        { this._getBPMContainer() }
        { this._getSlider() }
        { this._getPracticingContainer() }
      </View>
    );
  }

  render() {
    return (
      <View style={ styles.container }>
        {
          this.props.onStart
            ? this._getTimerOnStartLayout()
            : this._getTimerIsRunPauseLayout()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  bpmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderColor: '#6DA7C4',
  },
  bpmSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bpmValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bpm: {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  expandIconContainer: {
    padding: 15,
    paddingLeft: 0,
  },
  expandIcon: {
    width: 13,
    height: 7,
  },
  bpmValue: {
    width: 70,
    marginRight: 5,
    fontSize: 37,
    textAlign: 'left',
  },
  bpmValueText: {
    paddingBottom: 5,
    fontSize: 13,
  },
  playIcon: {
    width: 44,
    height: 44,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1C76A4',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#6DA7C4',
  },
  slider: {
    // height: 65,
    width: Dimensions.get('window').width - INDENTS,
  },
  minusIcon: {
    marginVertical: 25,
    height: 4,
    width: 26,
  },
  plusIcon: {
    marginVertical: 15,
    height: 26,
    width: 26,
  },
  practicingContainer: {
    padding: 20,
  },
  practicing: {
    color: '#8DBAD1',
    fontSize: 17,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});

export default MetronomeSettings;
