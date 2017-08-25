import React from 'react';
import {
  View,
  InteractionManager,
  Text,
} from 'react-native';

import SortingComponent from '../common/sorting';
import ComplexList from '../common/extendedListSearch';
import {fetchTeachersPaginated} from '../../redux/actions/usersList';

import {baseStyles} from '../styles';
import {connect} from 'react-redux';

class SearchTeacherTab extends React.Component {
  constructor() {
    super();
    this.state = {
      allDataFetched: false,
      page: 0,
      list: []
    };
  }

  getNextItems() {
    if (this.props.teachers.status === 'fetching_new_page' || this.state.allDataFetched ) {
      return;
    }

    this.props.dispatch(fetchTeachersPaginated({ ...this.nextItemsOptions() }));
  }

  nextItemsOptions() {
    setTimeout(() => {
      this.setState({
        page: this.state.page + 1
      });
    }, 10);
    return {
      offset: this.state.page * 10,
      limit: 10
    };
  }

  componentDidMount() {
    if (this.props.teachers.list.length) {
      this.setState({
        allDataFetched: true,
        list: this.props.teachers.list
      });
      return true;
    }
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(fetchTeachersPaginated({ ...this.nextItemsOptions() }));
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.teachers.status === 'fetched' &&
      this.state.list.length === nextProps.teachers.list.length) {

      this.setState({
        allDataFetched: true
      });
      return;
    }

    this.setState({
      list: nextProps.teachers.list
    });
  }

  handleOnChange(value) {
    let reg = new RegExp(value, 'gi');

    this.setState({
      list: this.props.teachers.list.filter((item) => {
        return item.name.match(reg);
      })
    });
  }

  render() {
    return (
      <View style={ [baseStyles.content, baseStyles.contentL] }>
        <SortingComponent handleOnChange={this.handleOnChange.bind(this) } />
          <ComplexList light
            list={this.state.list} style={{flex: 1}}
            status={ this.props.teachers.status }
            onEndReached={ this.getNextItems.bind(this) }
            descriptionField={ ['country', 'city'] }
            onPress={ this.props.handleTeacherSelect }
            emptyText="No teachers there" />
      </View>
    );
  }
}

function props(state) {
  return {
    teachers: state.usersList
  };
}

export default connect(props)(SearchTeacherTab);
