import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';

import {baseStyles} from '../styles';
import AvatarComponent from '../common/avatar';

import SelectableList from '../common/selectableList';
import EmptyView from '../common/emptyView';

import Icon from 'react-native-vector-icons/MaterialIcons';

class SelectTeachersClassModal extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedClasses: [],
      height: Dimensions.get('window').height
    };
  }

  selectClass(data) {
    if (this.state.selectedClasses.indexOf(data.id) > -1) {
      this.setState({
        selectedClasses: [...this.state.selectedClasses.filter((item) => {
          return item.id !== data.id;
        })]
      });
      return;
    }
    this.setState({
      selectedClasses: [...this.state.selectedClasses, data]
    });
  }

  classesSignUp() {
    this.props.classesSignUp(this.state.selectedClasses);
    this.props.onClose();
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={ [baseStyles.modal, {height: this.state.height * 2.5/3, flex: 1}] }>
        <View style={{flex: 0.1}}>
          <TouchableOpacity
            style={ [styles.closeButton, ] }
            onPress={ this.props.onClose }>
            <Icon name="close" size={ 30 } color="#000" />
          </TouchableOpacity>
        </View>

        <View style={ [baseStyles.centeredContainer, styles.avatarWrapper, {flex:0.1}] }>
          <AvatarComponent
            style={ styles.avatar }
            avatar={ this.props.avatar } />
        </View>

        <View style={{marginBottom: 5, flex: 0.2}}>
          <Text style={ styles.teachersName }>{ `${this.props.name}'s classes` }</Text>
          <Text style={ styles.description }>Which class would you like to join</Text>
        </View>

        { this.props.classes.length ? (
          <View style={{flex: 0.6}} >
            <SelectableList
              light
              onPress={ this.selectClass.bind(this) }
              style={ styles.classesList }
              list={this.props.classes} />
            <View style={ [styles.buttonWrapper, {marginHorizontal: 16}] }>
              <TouchableOpacity
                onPress={ this.classesSignUp.bind(this) }
                style={ [baseStyles.submitButton, baseStyles.submitButtonSecondary] }>
                <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText] }>
                  Join Class
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={ styles.buttonWrapper }>
            <EmptyView>Teacher has no opened classes</EmptyView>
          </View>
        ) }

      </View>
    );
  }
}

let styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 15,
    left: 20
  },
  avatarWrapper: {
    marginVertical: 20
  },
  avatar: {
    height: 75,
    width: 75,
    borderRadius: 75/2
  },
  teachersName: {
    fontSize: 22,
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center'
  },
  classesList: {
    marginVertical: 20,
  },
  buttonWrapper: {
    marginTop: 20,
    marginBottom: 50
  }
});

export default SelectTeachersClassModal;
