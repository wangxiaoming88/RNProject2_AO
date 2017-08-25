import React from 'react';
import {
  View
} from 'react-native';

import {navigationStyles} from './styles';
import NavigationButton from './button';

import {connect} from 'react-redux';

class Navigation extends React.Component {
  constructor() {
    super();
  }

  generateButtons(buttons) {
    return buttons.map((item, i) => {
      let isActive = this.props.activeTab === i;
      return (
        <NavigationButton
          key={ i }
          changeTab={ () => this.props.goToPage(i) }
          isActive={isActive}
          item={item} />
      );
    });
  }

  render() {
    let buttons;
    // if (!this.props.assignments.list.length && !this.props.assignments.completed.length) {
    //   buttons = ['home', 'homework', 'practice', 'settings'];
    // } else {
      // buttons = ['home', 'homework', 'music library', 'practice', 'settings'];
    // }
      buttons = ['home', 'homework', 'practice', 'music library', 'settings'];
    // }
    return (
      <View style={ navigationStyles.navigation }>
        { this.generateButtons(buttons) }
      </View>
    );
  }
}

function props(state){
  return {
    assignments: state.assignments
  };
}

export default connect(props)(Navigation);
