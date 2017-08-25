import React from 'react';
import {
  RefreshControl
} from 'react-native';

class CustomRefreshControl extends React.Component {
  render() {
    return (
      <RefreshControl
        style={{ backgroundColor: 'transparent' }}
        tintColor="#1b97d3"
        title="Loading..."
        colors={['#1b97d3']}
        {...this.props} />
    )
  }
}

export default CustomRefreshControl;
