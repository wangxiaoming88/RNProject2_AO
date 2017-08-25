import React from 'react';
import {
  View,
  ScrollView,
  InteractionManager,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Keyboard,
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

import {fetchSheetmusicAllFields, cleanSerchResult} from '../../redux/actions/searchResult';

import SortingComponent from '../../components/common/sorting';

import AddNewModal from '../../components/practice/addNewModal';
import CustomPieceModal from '../musicLibrary/customPieceModal';



class AddPiecePage extends React.Component {
  constructor() {
    super();
    this.title = 'Add Practice Piece';
    this.state = {
      addNewPracticeIsVisible: false,
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(fetchPieces());
    });
  }

  /*componentWillReceiveProps(nextProps) {
    if (nextProps.pieces.status === 'fetching' || nextProps.pieces.status === 'fetched') {
      this.setState({
        list: nextProps.pieces.list
      });
    }
    // console.warn('list changed', nextProps);
  }*/

  handlePress(data) {
    // console.log('data: ', data);
    // this.props.dispatch(subscribePracticePiece(data.url,
    //   () => {
    //     this.props.dispatch(fetchMyPractices());
    this.props.navigator.push({ id: 'customPiece', idData: data.id });
    //     this._onRefresh();
    //   },
    //   (err) => Alert.alert(
    //     'Subscription Failed',
    //     Object.keys(err).map((key) => err.key).join('\n')
    //   )
    // ));
  }

  _onRefresh(isFirst = false) {
    this.isFirst = isFirst;
    this.props.dispatch(fetchMyPractices());
  }

  handleOnChange(value) {
    if (value.length > 3) {
      this.props.dispatch(fetchSheetmusicAllFields(value));
    } else {
      this.props.dispatch(cleanSerchResult());
    }
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
    // console.log('Pieces', this.props.pieces.list);
    // console.log('SearchResult : ', this.props.searchResult.list);
    
    const { list } = this.props.searchResult;

    return (
      <View style={ baseStyles.container }>
        <PageTitle
          onLeftButton={ () => {
            this.props.dispatch(cleanSerchResult());
            this.props.navigator.pop();
            this.props.route.onSuccessCb();
          }}
          leftButtonText="Back"
          iconLeft="navigate-before"
          title={ this.title } />
        <SortingComponent handleOnChange={this.handleOnChange.bind(this) } />
        <ScrollView
          style={ [baseStyles.content, baseStyles.contentL] }
          keyboardShouldPersistTaps={true}
        >

          { list.results.length ? (
            <SimpleList light list={list.results} style={{flex: 1}}
              onPress={ this.handlePress.bind(this) } />
          ) : (
            <EmptyView>Nothing here yet</EmptyView>
          ) }

          <View style={ {padding: 30} }>
            <TouchableOpacity
              onPress={ this._setAddNewModalVisible.bind(this, true) }
              style={ [baseStyles.submitButton, baseStyles.submitButtonSecondary] }>
              <Text
                style={ [baseStyles.textThinPlatform,baseStyles.submitButtonText, baseStyles.submitButtonSecondaryText] }>Save New +
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={ this.state.addNewPracticeIsVisible }
          transparent={ true }
          animationType="slide"
          onRequestClose={ this._setAddNewModalVisible.bind(this, false) }>

          <CustomPieceModal
            onClose={ this._setAddNewModalVisible.bind(this, false) }
          />
{/*          <View style={{flex:1,backgroundColor: 'rgba(0,0,0,0.4)'}}>
            <AddNewModal onClose={ this._setAddNewModalVisible.bind(this, false) } />
          </View>*/}
        </Modal>
      </View>
    );
  }
}

function props(state){
  return {
    pieces: state.pieces,
    searchResult: state.searchResult
  };
}

export default connect(props)(AddPiecePage);
