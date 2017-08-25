import Sound from 'react-native-sound';

const high = new Sound('high_seiko.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.warn('failed to load the sound', error);
  }
  console.log('duration in seconds: ' + high.getDuration());
});

export const playSound = () => {
  high.play();
};
