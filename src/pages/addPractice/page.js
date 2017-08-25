import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  InteractionManager,
  TouchableOpacity,
  Text,
  Alert,
  Modal
} from 'react-native';

import PageTitle from '../../components/common/pageTitle';

import SimpleList from '../../components/common/listAddPractice';
import EmptyView from '../../components/common/emptyView';

import {baseStyles} from '../../components/styles';
import {connect} from 'react-redux';
import {fetchMyPractices} from '../../redux/actions/practice';
import {fetchPieces} from '../../redux/actions/pieces';
import {subscribePracticePiece} from '../../redux/actions/practice';

import SortingComponent from '../../components/common/sorting';

import AddNewModal from '../../components/practice/addNewModal';

class AddPracticePage extends React.Component {
  constructor(props) {
    super(props);
    this.title = props.route.title;
    this.state = {
      list: [],
      addNewPracticeIsVisible: false
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(fetchPieces());
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.practice.status === 'fetching' || nextProps.practice.status === 'fetched') {
      this.setState({
        list: nextProps.practice.list
      });
    }
    // console.warn('list changed', nextProps);
  }

  handlePress(data) {
    let args = {
      title: data.title,
      type: 'piece',
      pieceUrl: data.url,
    };
    this.props.route.setupPractice(args);
    this.props.navigator.pop();
    // this.props.refTabView.goToPage(2);
    // this.props.navigator.replace({id: 'main', args,});
    // this.props.dispatch(subscribePracticePiece(data.url,
    //   () => {
        // this.props.dispatch(fetchMyPractices());
        // this._onRefresh();
        // this.props.navigator.pop();
        // this.props.route.refTabView.goToPage(2);
        // this.props.route.setupPractice(data);
        // this.props.navigator.pop();
        // this.props.navigator.replacePreviousAndPop({id: 'main', args: data, data: 5});
      // },
      // (err) => Alert.alert(
      //   'Subscription Failed',
      //   Object.keys(err).map((key) => err.key).join('\n')
      // )
    // ));
  }

  _onRefresh(isFirst = false) {
    this.isFirst = isFirst;
    this.props.dispatch(fetchMyPractices());
  }

  handleOnChange(value) {
    let reg = new RegExp(value, 'gi');

    this.setState({
      list: this.props.practice.list.filter((item) => {
        return item.title.match(reg);
      })
    });
  }

  _setAddNewModalVisible(visible) {
    this.setState({addNewPracticeIsVisible: visible});
    if (!visible) {
      this.props.dispatch(fetchPieces());
    }
    // InteractionManager.runAfterInteractions(() => {
    //   this.props.dispatch(fetchPieces());
    // });
  }

  render() {
    return (
      <View style={[ baseStyles.container ]}>
        <PageTitle
          onLeftButton={ () => {
            this.props.navigator.pop();
            this.props.route.onSuccessCb();
          }}
          leftButtonText="Back"
          iconLeft="navigate-before"
          title={ this.title } />
        <SortingComponent handleOnChange={this.handleOnChange.bind(this) } />
        <ScrollView
          style={ [baseStyles.content, baseStyles.contentL] }
          contentContainerStyle={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#EFEFF4' }}
        >
          { this.state.list.length ? (
            <SimpleList gray list={this.state.list}
              onPress={ this.handlePress.bind(this) } />
          ) : (
            <EmptyView>Nothing here yet</EmptyView>
          ) }

          <View>
            <TouchableOpacity
              onPress={ this._setAddNewModalVisible.bind(this, true) }
              style={ styles.createButton }
            >
              <Text
                style={[ baseStyles.textThinPlatform, styles.createButtonText ]}
              >
                Create Custom +
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={ this.state.addNewPracticeIsVisible }
          transparent={ true }
          animationType="slide"
          onRequestClose={ this._setAddNewModalVisible.bind(this, false) }>

          <View style={{flex:1,backgroundColor: 'rgba(0,0,0,0.4)'}}>
            <AddNewModal onClose={ this._setAddNewModalVisible.bind(this, false) } />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  createButton: {
    alignItems: 'center',
    padding: 15,
    paddingVertical: 25,
  },
  createButtonText: {
    color: '#78787B',
    fontSize: 17,
  },
});

function props(state){
  console.warn('state.pieces: ', state.pieces);
  console.warn('state.practice: ', state.practice);
  return {
    pieces: state.pieces,
    practice:  state.practice,
  };
}

export default connect(props)(AddPracticePage);
