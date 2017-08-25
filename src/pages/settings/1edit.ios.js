import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';

import {baseStyles} from '../../components/styles';
import PageTitle from '../../components/common/pageTitle';

import TextInput from '../../components/common/form/textInput';
import {reduxForm, change} from 'redux-form';
import {updateData, logout, updateUserPhoto} from '../../redux/actions/user';

import validationPatterns from '../../services/validationPatterns';

import PhotoComponent from '../../components/settings/photo';

import Icon from 'react-native-vector-icons/MaterialIcons';

// import styles from './styles';

const fields = ['email', 'firstName', 'lastName', 'location'];

/**
 * Splits api name into two fields.
 * @param  {string} name - fullname, received from serverAuthCode
 * @return {Array<string>} - [first name, second name]
 */
function parseName(name) {
  return name.split(' ');
}

/**
 * Validates form data.
 * @param  {Object} values - serialized form
 * @return {Object}        - errors object
 */
function validate(values) {
  let errors = {};

  if (!values.email) {
    errors.email = 'This field is required';
  } else if (!values.email.match(validationPatterns.email)) {
    errors.email = 'This email is not valid';
  }

  return errors;
}

class SettingsEditPage extends React.Component {
  constructor() {
    super();

    this.title = 'Edit Profile';

    this.state = {
      locationStatus: null
    };
  }

  /**
  * Logout User and moves to welcome page.
  */
  logout() {
    this.props.dispatch(logout(() => {
      this.props.navigator.resetTo({id: 'welcome', unauthorized: true});
    }));
  }

  feedBack() {

  }

  _getMyLocation() {
    this.setState({
      locationStatus: 'fetching'
    });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}`)
          .then((resp) => resp.json()).then((result) => {
            let _res = result.results.find((location) => {
              return location.types.indexOf('locality') > -1 && location.types.indexOf('political') > -1;
            });

            if (_res) {
              this.setState({
                locationStatus: 'success'
              });
              this.props.dispatch(change('profileSettingsForm', 'location', _res.formatted_address));
            }
          });
      }, (err) => {
        this.setState({
          locationStatus: 'failed'
        });
        console.log(err);
      }
    );
  }

  _getLocationIcon() {
    switch (this.state.locationStatus) {
      case 'fetching':
        return (
          <Icon name="gps-not-fixed" size={ 20 } color="black" />
        );
      case 'success':
        return (
          <Icon name="gps-fixed" size={ 20 } color="black" />
        );
      case 'failed':
        return (
          <Icon name="gps-off" size={ 20 } color="black" />
        );
      default:
        return (
          <Icon name="gps-not-fixed" size={ 20 } color="black" />
        );
    }
  }

  componentDidMount() {
    this._getMyLocation();
  }

  /**
   * Submits user settings form.
   * @param {Object} data - serialized from data.
   */
  _onSubmit(data) {
    data.name = `${data.firstName} ${data.lastName}`;

    this.props.dispatch(updateData(data, () => {
      this.props.navigator.pop();
    }));
  }

  render() {
    let {
      handleSubmit,
      fields: {
        email, firstName, lastName, location
      }
    } = this.props;

    return (
      <View style={ baseStyles.container }>
        <PageTitle
          title={ this.title }
          onLeftButton={ () => this.props.navigator.pop() }
          leftButtonText="Back"
          iconLeft="navigate-before"
          onRightButton={ handleSubmit(this._onSubmit.bind(this)) }
          rightButtonText="Done" />
        <ScrollView
          style={ [baseStyles.content, baseStyles.contentL] }>

        <View style={ styles.block }>
          <View style={ baseStyles.twoInputWrapper}>
            <View style={{width: 140}}>
              <PhotoComponent
                onUpdate={ (data) => this.props.dispatch(updateUserPhoto(data)) }
                {...this.props.user} />
            </View>
            <View style={ {flex: 1} }>
              <TextInput
                style={{height:40, color: 'gray',fontSize:15}}
                light
                autoCapitalize="words"
                placeholder="First name"
                {...firstName} />
              <TextInput
                style={{height:40, color: 'gray',fontSize:15}}
                light
                autoCapitalize="words"
                placeholder="Last name"
                {...lastName} />
              <TextInput
                style={{height:40, color: 'gray',fontSize:15}}
                light
                noborder
                placeholder="E-mail"
                keyboardType="email-address"
                {...email} />
            </View>
          </View>
        </View>

        <View style={ [baseStyles.blockTitle, {marginTop: -15, marginBottom: -20}] }>
          <Text style={ [baseStyles.blockTitleText, baseStyles.blockTitleTextL, {fontSize: 16}] }>LOCATION</Text>
        </View>
        <View style={ styles.block}>
          <View style={ baseStyles.twoInputWrapper }>
            <View style={ styles.label }>
              <Text style={ styles.labelText }>Location</Text>
            </View>
            <View style={ {flex: 1} }>
              <TextInput
                style={{height:40, color: 'gray',fontSize:15}}
                light
                noborder
                ref="locationField"
                autoCapitalize="words"
                placeholder="City, Country"
                {...location}
                 />
               <TouchableOpacity
                 style={ styles.locationIcon }
                 onPress={ this._getMyLocation.bind(this) }>
                 { this._getLocationIcon.call(this) }
               </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={ [{padding: 20}] }>

          {/*<TouchableOpacity onPress={ this.feedBack.bind(this) } style={{marginBottom: 10}}>
            <Text style={ [baseStyles.link, {textAlign: 'center'}] }>Need help or have feedback?</Text>
          </TouchableOpacity>*/}

          <TouchableOpacity onPress={ this.logout.bind(this) }>
            <Text style={ [baseStyles.link, {textAlign: 'center', color: 'black'}] }>Log out</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  block: {
    marginVertical: 20,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'lightgrey',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  label: {
    width: 120,
    paddingLeft: 20,
    paddingVertical: 13
  },
  labelText: {
    color: 'black',
    fontSize: 16,
  },
  locationIcon: {
    position: 'absolute',
    right: 10,
    top: 6,
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

function props(state) {
  return {
    initialValues: {
      firstName: parseName(state.user.name)[0],
      lastName: parseName(state.user.name).slice(1, parseName(state.user.name).length).join(' '),
      ...state.user
    },
    user: state.user
  };
}

export default reduxForm({
  form: 'profileSettingsForm',
  fields,
  validate
}, props)(SettingsEditPage);
