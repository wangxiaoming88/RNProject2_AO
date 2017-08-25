import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Alert,
  Platform
} from 'react-native';

import { baseStyles } from '../styles';
import TextInput from '../../components/common/form/textInput';

import {addNewPractice} from '../../redux/actions/practice';
import Utils from '../../services/utils';

import {fetchMyPractices, subscribePracticePiece} from '../../redux/actions/practice';

import {reduxForm} from 'redux-form';

let fields = ['title'];

/**
 * Validates form data.
 * @param  {Object} values - serialized form
 * @return {Object}        - errors object
 */
function validate(values) {
  let errors = {};

  if (!values.title) {
    errors.title = 'This field is required';
  }

  return errors;
}

class AddNewModal extends React.Component {
  _submit(data) {
    this.props.dispatch(addNewPractice(data.title, (res) => {
      Alert.alert('Add Practice', 'Practice successfully added');
      this.props.dispatch(subscribePracticePiece(res.url, () => {
        this.props.dispatch(fetchMyPractices());
        this.props.onClose();
      }), Utils.parseServerError);

    }, Utils.parseServerError));
  }

  render() {
    let {
      handleSubmit,
      fields: {
        title
      }
    } = this.props;

    var TextInputVar;

    if (Platform.OS === 'android') {
      TextInputVar = (
        <TextInput
          light
          placeholder="Practice title"
          onSubmitEditing={ handleSubmit(this._submit.bind(this)) }
          { ...title } />
        );
      } else {
        TextInputVar = (
          <TextInput
          style={{height: 40, color: 'black',fontSize: 15}}
          light
          placeholder="Practice title"
          onSubmitEditing={ handleSubmit(this._submit.bind(this)) }
          { ...title } />
        );
      }


    return (
      <View style={ [baseStyles.modal, styles.newModal] }>
        <Text style={ styles.description }>
          Type new practice title.
        </Text>
        <View style={{height: 70}}>
          {TextInputVar}
        </View>
        <View style={ [baseStyles.twoInputWrapper, {marginBottom: 25, marginTop: 10}] }>
          <TouchableOpacity
            style={ [baseStyles.submitButton, baseStyles.submitButtonSecondary, baseStyles.twoInputWrapperItem] }
            onPress={ handleSubmit(this._submit.bind(this)) }>
            <Text style={ [baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText] }>
              Submit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ [baseStyles.submitButton, baseStyles.twoInputWrapperItem] }
            onPress={ this.props.onClose }>
            <Text style={ baseStyles.submitButtonText }>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  modal: {
    bottom: null,
    left: null,
    right: null,
    flex: 0,
    alignSelf: 'center',
    position: 'relative',
  },
  newModal: {
    height: Dimensions.get('window').height - Dimensions.get('window').height / 4,
    paddingHorizontal: 8,
  },
  description: {
    fontSize: 16,
    color: 'black',
    margin: 20,
    textAlign: 'center'
  }
});

export default reduxForm({
  form: 'addNewModalForm',
  fields,
  validate
})(AddNewModal);
