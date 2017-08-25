import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  InteractionManager,
  StatusBar,
  Platform
} from 'react-native';
import {baseStyles} from '../../components/styles';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';

import TestYoutube from './testYoutube';
class WelcomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      wave0: new Animated.Value(0),
      wave1: new Animated.Value(0),
      wave2: new Animated.Value(0),
      wave3: new Animated.Value(0),
      wave4: new Animated.Value(0),
      wave5: new Animated.Value(0),
      wave6: new Animated.Value(0),
      wave7: new Animated.Value(0),
      wave8: new Animated.Value(0),

      youtube: true,
    };
  }

  componentDidMount() {
    // Analytics.get();
    InteractionManager.runAfterInteractions(() => {
      Animated.parallel([
        Animated.spring(
          this.state.wave0,
          {toValue: 8}
        ),
        Animated.spring(
          this.state.wave1,
          {toValue: 32}
        ),
        Animated.spring(
          this.state.wave2,
          {toValue: 90}
        ),
        Animated.spring(
          this.state.wave3,
          {toValue: 72}
        ),
        Animated.spring(
          this.state.wave4,
          {toValue: 40}
        ),
        Animated.spring(
          this.state.wave5,
          {toValue: 16}
        ),
        Animated.spring(
          this.state.wave6,
          {toValue: 48}
        ),
        Animated.spring(
          this.state.wave7,
          {toValue: 72}
        ),
        Animated.spring(
          this.state.wave8,
          {toValue: 16}
        )
      ]).start();
    });
  }

  render() {
    let view = (
      <LinearGradient colors={['#2699d3', '#33a0d6', '#28a0dc']} style={ baseStyles.linearGradient }>
        <StatusBar backgroundColor="#2699d3" animated={true} barStyle="light-content" />
        <View style={ [styles.logoSection, {marginTop: 40}] }>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={ styles.logo }>
              <Animated.View style={ [styles.logoWave, {height: this.state.wave0}] } />
              <Animated.View style={ [styles.logoWave, {height: this.state.wave1}] } />
              <Animated.View style={ [styles.logoWave, {height: this.state.wave2}] } />
              <Animated.View style={ [styles.logoWave, {height: this.state.wave3}] } />
              <Animated.View style={ [styles.logoWave, {height: this.state.wave4}] } />
              <Animated.View style={ [styles.logoWave, {height: this.state.wave5}] } />
              <Animated.View style={ [styles.logoWave, {height: this.state.wave6}] } />
              <Animated.View style={ [styles.logoWave, {height: this.state.wave7}] } />
              <Animated.View style={ [styles.logoWave, {height: this.state.wave8}] } />
            </View>

            <View style={ [styles.pageTitle, {marginTop: 15}] }>
              <Text style={ [styles.pageTitleText, baseStyles.text, {fontWeight: (Platform.OS  === 'android') ? 'bold' : '400',fontSize: 26,}] }>
                Music Monitor
              </Text>
              <Text style={ [styles.pageSubtitleText, baseStyles.text, {fontSize: 15,marginTop:4}] }>
                Practice, track progress, repeat.
              </Text>
            </View>
          </View>
        </View>

        <View style={ styles.form }>
          <TouchableOpacity
            style={ [baseStyles.submitButton, {height: (Platform.OS  === 'android') ? 40 : 35, marginBottom: (Platform.OS  === 'android') ? 15 : 10, marginTop: 20}] }
            onPress={ () => this.props.navigator.push({
              id: 'register',
              unauthorized: true
            }) }>
            <Text style={ [baseStyles.submitButtonText, {fontWeight: (Platform.OS  === 'android') ? 'bold' : '400', fontSize: (Platform.OS  === 'android') ? 17 : 16}] }>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ [baseStyles.submitButton, {height: (Platform.OS  === 'android') ? 40 : 35, marginBottom: 20, backgroundColor: 'rgba(0,0,0,0)'}, baseStyles.submitButtonSecondary] }
            onPress={ () => this.props.navigator.push({
              id: 'login',
              unauthorized: true
            }) }>
            <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText, {fontWeight: (Platform.OS  === 'android') ? 'bold' : '400', fontSize: (Platform.OS  === 'android') ? 17 : 16}] }>
              I Already Have an Account
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );

    if (!this.state.youtube) view = (<TestYoutube />);
    return view;
  }
}

export default WelcomePage;
