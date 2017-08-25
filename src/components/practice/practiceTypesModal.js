import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';

import { baseStyles, baseColor } from '../styles';
import Icon from 'react-native-vector-icons/Entypo';
import PracticesList from './list';

class PracticeTypesModal extends React.Component {
  constructor() {
    super();
  }

  calculateScrollHeight() {
    let screenHeight = Dimensions.get('window').height / 2;
    let scrollHeight = {};

    if (this.props.list.length * 60 > screenHeight) {
      scrollHeight = {height: screenHeight};
    }

    return scrollHeight;
  }

  render() {
    return (
      <View style={ baseStyles.modal }>
        <TouchableOpacity
          onPress={ this.props.onClose }
          style={ [baseStyles.centeredContainer, styles.closeButton] }>
          <View style={ baseStyles.buttonWithIcon }>
            <Icon style={{marginTop: 1,marginRight: 10}} size={ 30 } name="chevron-thin-down" resizeMode={'contain'} color="#000000" />
            <Text style={ [styles.closeButtonText, baseStyles.textThinPlatform,{fontWeight: (Platform.OS === "android") ? 'bold' :'400', fontSize: 16}] }>What are you practicing?</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.scrollViewWrapper}>
          <ScrollView style={ this.calculateScrollHeight() }>
            <PracticesList light
              list={this.props.list}
              onPress={ this.props.handlePracticeSelect } />
          </ScrollView>
        </View>

        <TouchableOpacity
          style={ [styles.item, {marginBottom: 25}] }
          onPress={ this.props.onAddNew }>
          <Text style={ [styles.itemText,baseStyles.textThinPlatform, {color: baseColor, fontWeight: (Platform.OS === "android") ? 'bold' : '400', fontSize: 17}] }>Add new...</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    marginHorizontal: 8
  },
  itemText: {
    fontSize: 18,
    color: 'black'
  },
  scrollViewWrapper: {
    borderStyle: 'solid',
    marginHorizontal: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'lightgray'
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray'
  },
  closeButton: {
    paddingVertical: 20
  },
  closeButtonText: {
    fontSize: 20,
    color: 'black'
  }
});

export default PracticeTypesModal;
