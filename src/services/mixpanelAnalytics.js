import { Platform } from 'react-native';
var Mixpanel = require('react-native-mixpanel');

class Analytics {

  constructor() {
    // this.token = 'c38ea3c0745e97c08af205f3dd4f4419';
    this.token = '97a22f7884d88b5b9c1674dbe51061bc';
    this.ID = '';
    this.app = 'MIXPANEL';
    Mixpanel.sharedInstanceWithToken(this.token);
  }

  /////////////////////
  // Authentication  //
  /////////////////////
  register(email, name, role = 'student', authType = 'normal') {
    this.ID = email;
    Mixpanel.createAlias(email);
    Mixpanel.identify(email);

    this.peopleFirstName(name);
    this.peopleEmail(email);
    this.peopleRole(role);

    this.track('Register', {
      email: email,
      name: name,
      authType,
    });

    // this._('register', `${email},${name},${role}`);
  }

  login(email = 'anonymous user', authType = 'normal') {
    this.ID = email;
    Mixpanel.identify(email);
    this.track('Login', {
      ID: email,
      authType,
    });

    // this._('login','Login');
  }

  logout() {
    Mixpanel.identify(this.ID);

    this.track('Logout', {
      ID: this.ID,
    });

    Mixpanel.reset();

    // this._('logout','Logout Success.');
  }

  /////////////////////
  //      People     //
  /////////////////////
  set(key, value) {
    if (Platform.OS === 'ios') {
      const arg = {}; arg[key] = value;
      Mixpanel.set(arg);
      return;
    }

    Mixpanel.set(key, value);
  }

  changeEmail() {

  }

  peopleFirstName = (first) => this.set('$first_name', first);

  peopleLastName = (last) => this.set('$last_name', last);

  peopleEmail = (email) => this.set('$email', email);

  peopleRole = (role) => this.set('role', role);

  peopleNewEmail = (email) => this.changeEmail(email);

  /////////////////////
  //      Tracks     //
  /////////////////////
  track(name = 'Action.', options = '') {
    if (options === '') {
      Mixpanel.track(name);

      this._('track', name);
      return;
    }

    Mixpanel.trackWithProperties(name, options);

    this._('trackWithProperties', name);
  }

  practiceStart() {
    this.track('Start practice.');
  }

  practicePause() {
    this.track('Pause practice.');
  }

  practiceResume() {
    this.track('Resume practice.');
  }

  practiceEnd() {
    this.track('End practice.');
  }


  view(page) {
    if (this.ID === '') {
      return;
    }

    this.track(`View: "${page} Page"`);

    this._('View: ', page);
  }

  _(func, title) {
    // console.warn(`${this.app} [${func}]: ${title}`);
  }

  ////////////////////////////////////////

  // get() {
  //   let that = this;
  //   Mixpanel.getDistinctId(function(id) {
  //     that._('id', id);
  //   });
  // }
}

export default new Analytics();
