import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

class Tag extends React.Component {
  constructor() {
    super();

    this.state = {
      isActive: false,
    }
  }

  toggleTagState = () => {
    this.setState({ isActive: !this.state.isActive })
  }

  render() {
    return (
      <TouchableOpacity
        onPress={ () => this.toggleTagState() }
        style={[ styles.tagContainer, this.state.isActive && styles.tagContainerActive ]}
      >
        <Text style={[ styles.tag, this.state.isActive && styles.tagActive ]}>
          { this.props.tag }
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  tagContainer: {
    borderRadius: 3,
    borderColor: '#979797',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 7,
    paddingHorizontal: 10,
    marginRight: 15,
    marginBottom: 15,
  },
  tagContainerActive: {
    backgroundColor: '#979797',
  },
  tag: {
    color: '#6D6D72',
    fontSize: 15,
  },
  tagActive: {
    color: 'white',
  },
});

export default Tag;