import React from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import {practiceStyles} from './styles';

var {height, width} = Dimensions.get('window');

class PracticeItem extends React.Component {
  constructor() {
    super();
    this.state = {
      progressWidth: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (typeof this.props.progress === 'number') {
      Animated.spring(
        this.state.progressWidth,
        {toValue: this.props.progress}
      ).start();
    }
  }

  handlePress() {
    this.props.navigator.push({id: 'practiceLesson', args: {
        name: this.props.name
      }
    });
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={ 0.4 } onPress={ this.handlePress.bind(this) }>
        <View style={practiceStyles.item}>
          <Text style={practiceStyles.itemName}>{ this.props.name }</Text>
          { (this.props.progress) ? (<View>
            <Text style={practiceStyles.progressText}>{ this.props.progress }%</Text>
          </View>) : null }
        </View>
        <Animated.View style={[practiceStyles.progressBar, {
            backgroundColor: this.state.progressWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['yellow', 'green']
            }),
            width: this.state.progressWidth.interpolate({
              inputRange: [0, 1, 100],
              outputRange: [0, 0, width]
            })
          }
        ]} />
      </TouchableOpacity>
    );
  }
}

export default PracticeItem;
