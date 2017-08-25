import React from 'react';
import {
  View,
  ScrollView
} from 'react-native';

import {baseStyles} from '../../components/styles';
import {connect} from 'react-redux';

import {
  fetchAssigments,
  fetchCompletedAssigments
} from '../../redux/actions/assignments';

import RefreshControl from '../../components/common/refreshControl';
import PageTitle from '../../components/common/pageTitle';

import SimpleListBlock from '../../components/common/listBlock';
import AssigmentsList from '../../components/common/assignmentsList';
import Analytics from '../../services/mixpanelAnalytics';

class HomeWorkPage extends React.Component {
  constructor() {
    super();

    this.title = 'Homework';
    this.isFirst = true;
  }

  componentDidMount() {
    this._onRefresh(true);

    // if (this.isFirst) {
      Analytics.view(this.title);
    // }
  }

  _onRefresh(isFirst = false) {
    this.isFirst = isFirst;
    this.props.dispatch(fetchAssigments());
    this.props.dispatch(fetchCompletedAssigments());
  }

  handlePress(data) {
    let args = {
      name: data.task.name,
      type: 'assignment',
      data
    };

    this.props.navigator.push({id: 'practiceLesson', args});
  }

  render() {
    return (
      <View style={ baseStyles.container }>
        <PageTitle title={ this.title } />
        <ScrollView
          style={ [baseStyles.content, baseStyles.contentL] }
          refreshControl={ <RefreshControl
            refreshing={ this.isFirst && this.props.assignments.status === 'fetching' }
            onRefresh={ this._onRefresh.bind(this) } /> }>

          <SimpleListBlock light title="in progress"
            {...this.props.assignments}
            onPress={ this.handlePress.bind(this) }
            listElement={ AssigmentsList } />
          <SimpleListBlock light title="completed"
            list={ this.props.assignments.completed }
            status={ this.props.assignments.status }
            listElement={ AssigmentsList } />
        </ScrollView>
      </View>
    );
  }
}

function props(state){
  return {
    assignments: state.assignments,
    completed: state.completed
  };
}

export default connect(props)(HomeWorkPage);
