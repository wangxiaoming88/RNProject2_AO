import React from 'react';
import {
  Alert,
  View,
  ScrollView,
  StatusBar,
  Modal,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import Utils from '../../services/utils';

import UserInfoBlock from '../../components/home/userInfoBlock';
import PracticeProgressBlock from '../../components/home/practiceProgressBlock';
import SimpleListBlock from '../../components/common/listBlock';
import AssigmentsList from '../../components/common/assignmentsList';
import GoalsList from '../../components/common/goalsList';
import RefreshControl from '../../components/common/refreshControl';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { baseStyles, secondColor } from '../../components/styles';
import EditCreateGoalModal from './editCreateGoalModal';
import { fetchMyGoals } from '../../redux/actions/goals';
import { fetchAssigments } from '../../redux/actions/assignments';
import {
  fetchProgressChartData,
  fetchProgressChartDataBetweenDates
} from '../../redux/actions/progressChart';
import { fetchMyLevel } from '../../redux/actions/user';
import {
  createGoal,
  editGoal,
  deleteGoal,
  saveInterimDataGoal,
  cleanInterimDataGoal
} from '../../redux/actions/goals';
import Analytics from '../../services/mixpanelAnalytics';

class HomePage extends React.Component {
  constructor() {
    super();

    this.title = 'Home';
    this.state = {
      isEditModalVisible: false,
      isCreateModalVisible: false,
    };
    this.goalData = undefined;
  };

  componentDidMount() {
    if (this.props.route.alert) {
      const { type, holder, name } = this.props.route.alert;
      this.dropdown.alert(type, holder, name);
    }

    Analytics.view(this.title);
  };

  _onRefresh = (isFirst = false) => {
    this.isFirst = isFirst;
    this.props.dispatch(fetchMyLevel());
    this.props.dispatch(fetchAssigments());
    this.props.dispatch(fetchProgressChartData());
    this.props.dispatch(fetchProgressChartDataBetweenDates());
    this.props.dispatch(fetchMyGoals());
  };

  handlePress = (data) => {
    let args = {
      name: data.task.name,
      type: 'assignment',
      data
    };

    this.props.navigator.push({id: 'practiceLesson', args});
  };

  handleGoalsPress = (data) => {
    //console.log('goals pressed', data);
    this.goalData = {
      ...data,
      callback() {
        //console.log('delete goal callback');
        this.handleModalVisible('isEditModalVisible', false);
        this._onRefresh();
      }
    };
    this.handleModalVisible('isEditModalVisible', true);
  };

  handleModalVisible = (modalName, isVisible) => {
    this.setState({ [modalName]: isVisible });
  };

  _createGoal = (duration, intervalTab, pieceUrl) => {
    let _id = this.props.goals.list.length + 1;
    // let { duration, intervalTab, pieceUrl } = this.state;
    let _interval = intervalTab == 0 ? 'week' : 'month';
    this.props.dispatch(
      createGoal(
        _id, duration, _interval, pieceUrl,
        () => {
          this.props.dispatch(fetchMyGoals());
          this.handleModalVisible('isCreateModalVisible', false);
          Alert.alert('Create Goal', 'Goal successfully created');
        },
        Utils.parseServerError
      )
    );
  };

  _editGoal = (duration, intervalTab, pieceUrl) => {
    let goal = this.goalData;
    // let { duration, intervalTab, pieceUrl } = this.state;
    this.props.dispatch(
      editGoal(
        goal.id, duration, intervalTab, pieceUrl, () => {
          this.props.dispatch(fetchMyGoals());
          this.handleModalVisible('isEditModalVisible', false);
          Alert.alert('Edit Goal', 'Goal successfully edited');
        },
        Utils.parseServerError)
    );
  };

  _deleteGoal = () => {
    this.props.dispatch(
      deleteGoal(
        this.goalData.id, (res) => {
          this.props.dispatch(fetchMyGoals());
          this.handleModalVisible('isEditModalVisible', false);
          Alert.alert('Delete Goal', 'Goal successfully deleted');
        },
        Utils.parseServerError)
    );
  };

  render() {
    return (
      <View style={baseStyles.container}>
        <StatusBar backgroundColor={secondColor} barStyle='light-content' />
        <UserInfoBlock
          goToProfile={this.props.goToProfile}
          goToPractice={this.props.goToPractice}
          {...this.props.user}
        />
        <ScrollView style={[baseStyles.content, baseStyles.contentL]}
          refreshControl={
            <RefreshControl
              refreshing={!this.isFirst && this.props.assignments.status === 'fetching'}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          {
          // <Text onPress={ () => this.props.navigator.push({ id: 'askQuestion' }) }>Ask</Text>
          }
          <View style={{ backgroundColor: 'white' }}>
            <PracticeProgressBlock { ...this.props.progressChart } />
          </View>
          <SimpleListBlock
            light
            title='upcoming goals'
            titleLink='+ create goal'
            onTitleLinkPress={ () => this.handleModalVisible('isCreateModalVisible', true) }
            onPress={ this.handleGoalsPress }
            listElement={ GoalsList }
            { ...this.props.goals }
          />
          {
            this.props.assignments.status === 'fetched' && !this.props.assignments.list.length
              ? null
              : <SimpleListBlock light title='assignments due'
                  onPress={this.handlePress}
                  listElement={AssigmentsList}
                  {...this.props.assignments}
                />
          }
        </ScrollView>
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          closeInterval={2000}
          titleStyle={baseStyles.text}
          messageStyle={baseStyles.text}
        />
        <Modal
          visible={ this.state.isCreateModalVisible }
          transparent={ true }
          animationType='slide'
          onRequestClose={ () => this.handleModalVisible('isCreateModalVisible', false) }
        >
          <EditCreateGoalModal
            isEdit={ false }
            navigator={ this.props.navigator }
            onCloseModal={ () => this.handleModalVisible('isCreateModalVisible', false) }
            onShowModal={ () => this.handleModalVisible('isCreateModalVisible', true) }
            createGoal={ this._createGoal }
            // onRefreshGoals={ () => this.props.dispatch(fetchMyGoals()) }
          />
        </Modal>
        <Modal
          visible={ this.state.isEditModalVisible }
          transparent={ true }
          animationType='slide'
          onRequestClose={ () => this.handleModalVisible('isEditModalVisible', false) }
        >
          <EditCreateGoalModal
            isEdit={ true }
            goal={ this.goalData }
            navigator={ this.props.navigator }
            onCloseModal={ () => this.handleModalVisible('isEditModalVisible', false) }
            onShowModal={ () => this.handleModalVisible('isEditModalVisible', true) }
            editGoal={ this._editGoal }
            deleteGoal={ this._deleteGoal }
            // onRefreshGoals={ () => this.props.dispatch(fetchMyGoals()) }
          />
        </Modal>
      </View>
    );
  }
}

function props(state) {
  return {
    user: state.user,
    assignments: state.assignments,
    progressChart: state.progressChart,
    goals: state.goals
  };
}

export default connect(props)(HomePage);
