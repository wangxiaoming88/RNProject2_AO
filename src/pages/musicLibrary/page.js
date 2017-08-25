import React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  ListView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

import RefreshControl from '../../components/common/refreshControl';
import PageTitle from '../../components/common/pageTitle';
import {styles} from '../../components/common/list';
import Utils from '../../services/utils';

import OptionsModal from './optionsModal';
import EditCreateGoalModal from '../home/editCreateGoalModal';

import SimpleListBlock from '../../components/common/listBlock';
import EmptyMusicLibrary from './emptyMusicLibrary';
import {baseStyles} from '../../components/styles';
import {connect} from 'react-redux';
import {fetchMyPractices, fetchMyPracticesTime} from '../../redux/actions/practice';
import {
  createGoal,
  editGoal,
  deleteGoal,
  saveInterimDataGoal,
  cleanInterimDataGoal,
  fetchMyGoals } from '../../redux/actions/goals';

import PracticesList from './list';
import Analytics from '../../services/mixpanelAnalytics';

class MusicLibraryPage extends React.Component {
  constructor(props) {
    super(props);
    this.title = 'Music Library';
    this.isFirst = true;
    this._onRefresh = this._onRefresh.bind(this);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows(props.practice.list),
      isOptionsModalVisible: false,
      isCreateModalVisible: false,
      isCreated: false,
      goal: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.practice.list) {
      this.setState({dataSource: this.ds.cloneWithRows(nextProps.practice.list)})
    }
  }

  componentDidMount() {
    this._onRefresh(true);
    Analytics.view(this.title);
  }

  handlePress = (data) => {
    console.log('REPLACE', data);
    let { refPractice } = this.props;
    let args = {
      title: data.title,
      type: 'piece',
      pieceUrl: data.url,
    };
    if (refPractice) {
      // console.log('PRACTICE_RRRRRRRR', refPractice.setupPractice);
      refPractice.setupPractice(args);
      this.props.refTabView.goToPage(2);
    } else {
      // console.log('PRACTICE_RRRRRRRR_NOOOO', refPractice);
      this.props.navigator.replace({ id: 'main', args });
    }
    // this.props.refTabView.goToPage(2);
    //this.props.navigator.replace({ id: 'main', args });
  }

  addNewPractice() {
    this.props.navigator.push({id: 'addPiecePage', onSuccessCb: this._onRefresh});
  }

  getPiecePracticeTime = (pieceUrl, piecePractice) => {
    if (piecePractice.length > 0) {
      let time = piecePractice.reduce((sum, current) => {
        return sum + current.duration
      }, 0);
      return `${ time } min`;
    } else return '0 min'
  };

  _createGoal = (duration, intervalTab, pieceUrl) => {
    let _id = this.props.goals.list.length + 1;
    let _interval = intervalTab == 0 ? 'week' : 'month';
    this.props.dispatch(
      createGoal(
        _id, duration, _interval, pieceUrl,
        () => {
          this.props.dispatch(fetchMyGoals());
          this.setState({ isCreateModalVisible: false });
          Alert.alert('Create Goal', 'Goal successfully created');
        },
        Utils.parseServerError
      )
    );
  };

  _editGoal = (duration, intervalTab, pieceUrl) => {
    let { goal } = this;
    this.props.dispatch(
      editGoal(
        goal.id, duration, intervalTab, pieceUrl, () => {
          this.props.dispatch(fetchMyGoals());
          this.setState({ isCreateModalVisible: false });
          Alert.alert('Edit Goal', 'Goal successfully edited');
        },
        Utils.parseServerError
      )
    );
  };

  _deleteGoal = () => {
    let { goal } = this;
    this.props.dispatch(
      deleteGoal(
        goal.id, () => {
          this.props.dispatch(fetchMyGoals());
          this.setState({ isCreateModalVisible: false });
          Alert.alert('Delete Goal', 'Goal successfully deleted');
        },
        Utils.parseServerError
      )
    );
  };

  _onRefresh(isFirst = false) {
    this.isFirst = isFirst;
    this.props.dispatch(fetchMyPractices());
    this.props.dispatch(fetchMyPracticesTime());
  }

  seeAllPress(title) {
    this.props.navigator.push({
      id: 'seeAllMusicLibrary',
      title,
      onSuccessCb: this._onRefresh,
      refTabView: this.props.refTabView
    });
  }

  _renderRow(rowData) {
    let id = null;
    let goalToEdit = this.props.goals.list.filter(goal => {
      if (goal.piece.url === rowData.url) {
        id = goal.id;
        return true;
      }
    });
    let isCreated = !!goalToEdit.length;

    return (
      <View
        style={{flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              //marginRight: 14,
              backgroundColor: 'white',
              borderColor: '#C8C7CC',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
      >
        <TouchableOpacity
          activeOpacity={ 0.4 }
          key={rowData.id}
          // {...rowData}
          onPress={ () => this.handlePress(rowData) }
          style={
              {paddingHorizontal: 15,
                flex: 6,
               flexDirection: 'column',
               justifyContent: 'space-between',
               alignItems: 'flex-start',
               paddingVertical: 7,
               borderColor: '#4ECEB7',
            borderLeftWidth: isCreated ? 4 : 0,
              }}>
          <Text
            style={[ styles.itemText, styles.itemTextL,{ fontSize: 17, marginBottom: 5 } ]}
            numberOfLines={ 1 }
          >
            { rowData.title }
          </Text>
          <Text
            style={[ styles.itemText, styles.itemTextL, { color: '#8F8E94', fontSize: 15 } ]}
          >
            {this.getPiecePracticeTime(
              rowData.url,
              this.props.practice.practiceTime.filter(practice => {
                if ((practice.piece === rowData.url) && (practice.duration > 0)) {
                  return practice
                }
              })
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              paddingRight: 5,
              }}
          onPress={() => {
            let tabIndex = isCreated && goalToEdit[0].interval === 'week' ? 0 : 1;
            let data = {
              id,
              duration: isCreated ? goalToEdit[0].duration : null,
              intervalTab: isCreated ? tabIndex : 0,
              pieceTitle: rowData.title,
              pieceUrl: rowData.url,
             };
            this.goal = data;

            this.props.dispatch(saveInterimDataGoal(data));
            this.setState({
              isCreated,
              isOptionsModalVisible: true,
            });
          }}
        >
          <Image
            source={{ uri: 'more', width: 20, height: 20 }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      // (this.props.practice.status === 'fetched' && this.props.practice.practiceTimeStatus === 'fetched')
      // ?
        (this.props.practice.isEmpty)
        ?
          <EmptyMusicLibrary
            navigator = {this.props.navigator}
            onRefresh = {this._onRefresh}
            //{...this.props}
          />
        :
        <View style={ baseStyles.container }>
          <PageTitle
            title={ this.title }
            onRightButton={() => this.addNewPractice()}
            iconRight={"add"}
          />
          <ScrollView
            style={ [baseStyles.content, baseStyles.contentL] }
            refreshControl={
              <RefreshControl
                refreshing={ this.isFirst && this.props.practice.status === 'fetching' }
                onRefresh={ this._onRefresh.bind(this) }
              />
            }
          >
            <View style={ baseStyles.blockTitle } >
              <Text style={[ baseStyles.textThinPlatform, baseStyles.blockTitleText, baseStyles.blockTitleTextL ]}>
                LEARNING
              </Text>
            </View>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={rowData => this._renderRow(rowData)}
            />
            {/*<SimpleListBlock light title="learning" {...this.props.practice}
              onPress={ this.handlePress.bind(this) }
              titleLink={ 'see all' }
              checkKey={'learning'}
              listElement={ PracticesList }
              onTitleLinkPress={ this.seeAllPress.bind(this, 'LEARNING') }
            />
            <SimpleListBlock light title="pieces you know" {...this.props.practice}
              onPress={ this.handlePress.bind(this) }
              titleLink={ 'see all' }
              checkKey={'pieces'}
              listElement={ PracticesList }
              onTitleLinkPress={ this.seeAllPress.bind(this, 'PIECES YOU KNOW') }
            />*/}
          </ScrollView>
          <Modal
            visible={ this.state.isOptionsModalVisible }
            transparent={ true }
            animationType='slide'
            onRequestClose={ () => this.setState({
              isOptionsModalVisible: false,
              isCreated: false,
            })}
          >
            <OptionsModal
              navigator={ this.props.navigator }
              onCloseModal={ () => {
                this.setState({ isOptionsModalVisible: false });
                this.props.dispatch(cleanInterimDataGoal());
              }}
              onCreateEditGoal={ () => {
                this.setState({
                  isCreateModalVisible: true,
                  isOptionsModalVisible: false,
                });
              }}
              isCreated={ this.state.isCreated }
            />
          </Modal>
          <Modal
            visible={ this.state.isCreateModalVisible }
            transparent={ true }
            animationType='slide'
            onRequestClose={ () => this.setState({ isCreateModalVisible: false }) }
          >
            <EditCreateGoalModal
              isEdit={ this.state.isCreated }
              navigator={ this.props.navigator }
              onCloseModal={ () => this.setState({ isCreateModalVisible: false }) }
              fromLibrary={ true }
              goal={ this.goal }
              createGoal={ this._createGoal }
              editGoal={ this._editGoal }
              deleteGoal={ this._deleteGoal }
            />
          </Modal>
        </View>
      // :
      //   <ActivityIndicator
      //     size="large"
      //     style={{ flex: 1 }}
      //   />
    );
  }
}

function props(state){
  return {
    goals: state.goals,
    practice: state.practice,
  };
}

export default connect(props)(MusicLibraryPage);
