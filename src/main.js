import React from 'react';
import {
  Navigator,
  StatusBar,
} from 'react-native';

console.ignoredYellowBox = ['Warning: You are manually calling a React.PropTypes validation'];
// console.disableYellowBox = true;
// global.___DEV___ = false;

import { Provider } from 'react-redux';
import store from './redux/createStore';

import Routes from './services/routes';

class MusicMonitor extends React.Component {
  renderScene(route, navigator) {
    return (<Routes navigator={ navigator } route={ route } />);
  }

  render() {
    return (
      <Provider store={store}>
        <Navigator
          initialRoute={{id: 'main'}}
          renderScene={ this.renderScene }
          configureScene={ (route, routeStack) => {
            if (route.sceneConfigs) {
              return route.sceneConfigs;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }} />
      </Provider>
    );
  }
}

export default MusicMonitor;
