import React from 'react';
import {
  View,
  InteractionManager
} from 'react-native';

import {connect} from 'react-redux';

import {baseStyles} from '../../components/styles';
import RegisterOne from '../../components/register/stepOne';
import RegisterTwo from '../../components/register/stepTwo';

import {
  register,
  registerWithFB,
  registerWithGoogle
} from '../../redux/actions/user';

class RegisterPage extends React.Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0
    };
  }

  stepOneSubmit() {
    this.setState({
      activeStep: 1
    });
  }

  stepTwoSubmit(data) {
    data.password1 = data.password;
    data.password2 = data.password;
    data.role = 'student';  // TODO: check this
    this.props.dispatch(register(data, () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.navigator.resetTo({id: 'main', nologin: true});
      });
    }));
  }

  handleFacebookLogin(data) {
    this.props.dispatch(registerWithFB(data, () => {
      setTimeout(() => {
        this.props.navigator.resetTo({id: 'main', nologin: true});
      }, 10);
    }));
  }

  handleGoogleLogin(data) {
    this.props.dispatch(registerWithGoogle(data, () => {
      setTimeout(() => {
        this.props.navigator.resetTo({id: 'main', nologin: true});
      }, 10);
      // InteractionManager.runAfterInteractions(() => {
      //   this.props.navigator.resetTo({id: 'main', nologin: true});
      // });
    }));
  }

  render() {
    return (
      <View style={ baseStyles.container }>
        <View style={ baseStyles.content }>
          { (this.state.activeStep === 0) ? (
            <RegisterOne
              _onSubmit={ this.stepOneSubmit.bind(this) }
              onFacebookLogin={ this.handleFacebookLogin.bind(this) }
              onGoogleLogin={ this.handleGoogleLogin.bind(this) }
              {...this.props} />
          ) : (
            <RegisterTwo _onSubmit={ this.stepTwoSubmit.bind(this) } {...this.props} />
          ) }
        </View>
      </View>
    );
  }
}

export default connect()(RegisterPage);
