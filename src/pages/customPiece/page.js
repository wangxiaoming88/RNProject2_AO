import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';

import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PageTitle from '../../components/common/pageTitle';
import Question from '../../components/customPiece/question';
import { baseStyles } from '../../components/styles';

import { fetchMyPractices, subscribePracticePiece, addNewPracticeByID } from '../../redux/actions/practice';

import Utils from '../../services/utils';

import { connect } from 'react-redux';

let { width, height } = Dimensions.get('window');

class CustomPiece extends React.Component {
  constructor(props) {
    super(props);

    // this.data = props.route.data;
    this.data = props.searchResult;
    this.isPracticed = props.practice.list.filter(practice => {
      return practice.piece === this.data.url;
    }).length > 0;

    this.pdf = null;
    this.url = this.data.parts[0].pdf_url.split('?')[0];

    this.source = { uri: this.url };

    this.state = {
      modalVisible: false,
      page: 1,
      pageCount: 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.data = nextProps.searchResult;
    this.isPracticed = nextProps.practice.list.filter(practice => {
      return practice.piece === this.data.url;
    }).length > 0;
  }

  getDifficulty = (str) => {
    if (str && typeof str === 'string') {
      return str.slice(0, 1).toUpperCase() + str.slice(1);
    } else {
      return '-';
    }
  };

  getAvgDuration = (str) => {
    if (str && typeof str === 'string') {
      return str;
    } else {
      return '-';
    }
  };

  addToMyLibrary = () => {
    this.props.dispatch(addNewPracticeByID(this.data.id, this.data.title, (res) => {
      console.warn('NEW res', );
      Alert.alert('Add Practice', 'Practice successfully added');
      this.props.dispatch(subscribePracticePiece(res.url, () => {
        this.props.dispatch(fetchMyPractices());
      }), Utils.parseServerError);
    }, Utils.parseServerError));
  }

  getPieceActionButton = () => {
    const title = this.isPracticed ? 'Practice' : 'Add to My Library +';
    const _onPress = this.isPracticed
      ? () => console.warn(title)
      : () => this.addToMyLibrary();
      // : () => this.props.dispatch(subscribePracticePiece(
      //     this.data.url,
      //     () => this.props.dispatch(fetchMyPractices())
      //   ));

    return (
      <TouchableOpacity onPress={ _onPress }>
        <View style={ styles.addButton }>
          <Text style={ styles.addButtonText }>
            { title }
          </Text>
        </View>
      </TouchableOpacity>
    )
  };

  getSetGoalButton = () => {
    if (this.isPracticed) {
      return (
        <View style={ styles.setGoalContainer }>
          <TouchableOpacity>
            <View style={ styles.setGoalButton }>
              <Text style={ styles.setGoalButtonText }>
                Set Goal
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  };

  getSeeAllButton = () => {
    if (this.data.questions.length > 3) {
      return (
        <TouchableOpacity onPress={() => this.props.navigator.push({ id: 'seeAll', dataId: this.data.id, sheetMusic: this.data.url })}>
          <Text style={ styles.getHelpLinkToAll }>
            SEE ALL
          </Text>
        </TouchableOpacity>
      )
    }
  };

  getQuestions = () => {
    let { questions } = this.data;

    if (questions.length) {
      let _questions = questions.length < 4
        ? questions
        : questions.slice(0, 3);

      return (
        <View style={ styles.getHelpItems }>
          { _questions.map(_question => {
            return (
              <Question
                key={ _question.url }
                data={ _question }
                navigator={ this.props.navigator }
                isQuestionPage={ false }
                dataId = { this.data.id }
              />
            )
          })}
        </View>
      )
    }
  };

  getRemoveButton = () => {
    if (this.isPracticed) {
      return (
        <View style={ styles.removeButtonContainer }>
          <TouchableOpacity>
            <View style={ styles.removeButton }>
              <Text style={ styles.removeButtonText }>
                Remove from Library
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  };

  handlePress = () => {
    let data = {
      'sheetMusic' : this.data.url,
      'dataId' : this.data.id,
    };
    this.props.navigator.push({ id: 'askQuestion', data });
  }

  prePage = () => {
    if (this.pdf){
      let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
      this.pdf.setNativeProps({page: prePage});
      this.setState({page:prePage});
      console.log(`prePage: ${prePage}`);
    }
  }

  nextPage = () => {
    if (this.pdf){
      let nextPage = this.state.page + 1 > this.state.pageCount ? this.state.pageCount : this.state.page + 1;
      this.pdf.setNativeProps({page: nextPage});
      this.setState({page:nextPage});
      console.log(`nextPage: ${nextPage}`);
    }
  }

  render() {
    // console.log('CUSTOM PICES NEW SERCH RESULT', this.props.searchResult);
    console.log('THIS DATA', this.data);

    return (
      <View style={ baseStyles.container }>

        <PageTitle
          iconLeft="navigate-before"
          leftButtonText={ 'Back' }
          onLeftButton={ () => this.props.navigator.pop() }
        />

        <ScrollView
          style={[ baseStyles.content, baseStyles.contentL ]}
          showsVerticalScrollIndicator={ false }
        >

          <View style={ styles.titleContainer }>
            <Text
              style={[ styles.pieceTitle, baseStyles.textThinPlatform ]}
            >
              { this.data.title }
            </Text>
            <Text style={ styles.pieceSubTitle }>
              { this.data.composer }
            </Text>
          </View>

          <View style={ styles.addContainer }>
            <View style={ styles.thumbnailContainer }>
              <Image
                source={ require('../../../images/notes.jpg') }
                style={ styles.notesThumbnail }
              />
            </View>
            <View style={ styles.addButtonsContainer }>
              { this.getPieceActionButton() }
              <TouchableOpacity
                onPress={() => this.setState({modalVisible:true}) }
              >
                <View style={ styles.downloadButton }>
                  <Text style={ styles.downloadButtonText }>
                    Download sheet music
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={ styles.pieceProgressContainer }>
            <View style={[ styles.pieceProgressItem ]}>
              <Text style={[ styles.pieceProgressItemValue ]}>
                -
              </Text>
              <Text style={[ styles.pieceProgressItemTitle ]}>
                Practicing
              </Text>
            </View>
            <View style={[ styles.pieceProgressItem ]}>
              <Text style={[ styles.pieceProgressItemValue ]}>
                { this.getDifficulty(this.data.practice_difficulty) }
              </Text>
              <Text style={[ styles.pieceProgressItemTitle ]}>
                Difficulty
              </Text>
            </View>
            <View style={[ styles.pieceProgressItem, styles.pieceProgressItemLast ]}>
              <Text style={[ styles.pieceProgressItemValue ]}>
                { this.getAvgDuration(this.data.required_practice_time) }
              </Text>
              <Text style={[ styles.pieceProgressItemTitle ]}>
                Avg. Duration
              </Text>
            </View>
          </View>

          { this.getSetGoalButton() }

          <View style={ styles.videosContainer }>
            <View style={ styles.videosTitleContainer }>
              <Text style={ styles.videosTitle }>
                EXAMPLE VIDEOS
              </Text>
            </View>
            <View style={ styles.videos }>
              <View style={ styles.videosIconContainer }>
                <Image
                  source={ require('../../../images/youtube-icon.png') }
                  style={ styles.videosYoutubeIcon }
                />
              </View>

              <ScrollView
                horizontal={ true }
                contentContainerStyle={ styles.videosScrollContainer }
                showsHorizontalScrollIndicator={ false }
              >
                <View style={ styles.videosPreviewContainer }>
                  <Image
                    source={ require('../../../images/mock1.png') }
                    style={ styles.videosPreviewIcon }
                    //resizeMode={ 'stretch' }
                  />
                </View>
                <View style={ styles.videosPreviewContainer }>
                  <Image
                    source={ require('../../../images/mock2.png') }
                    style={ styles.videosPreviewIcon }
                    //resizeMode={ 'stretch' }
                  />
                </View>
                <View style={ styles.videosPreviewContainer }>
                  <Image
                    source={ require('../../../images/mock3.png') }
                    style={ styles.videosPreviewIcon }
                    //resizeMode={ 'stretch' }
                  />
                </View>
              </ScrollView>

            </View>
          </View>

          <View style={ styles.getHelpContainer }>
            <View style={ styles.getHelpTitleContainer }>
              <Text style={ styles.getHelpTitle }>
                GET HELP
              </Text>
              { this.getSeeAllButton() }
            </View>
            { this.getQuestions() }
            <View style={ styles.askButtonContainer }>
              {
              // <TouchableOpacity onPress={ () => this.props.navigator.push({ id: 'askQuestion' }) }> 
              }

              <TouchableOpacity onPress={ this.handlePress }>
                <View style={ styles.askButton }>
                  <Text style={ styles.askButtonText }>
                    Ask a Question
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          { this.getRemoveButton() }

        </ScrollView>
        <Modal 
          animationType={"fade"}
          transparent={false}
          visible={this.state.modalVisible}
        >
          <PageTitle
            iconLeft="clear"
            onLeftButton={ () => this.setState({modalVisible: false}) }
            title={this.data.title}
          />
          <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1b97d3', paddingBottom: 10}}>
            <TouchableOpacity
              disabled={this.state.page === 1}
              // style={this.state.page==1?styles.btnDisable:styles.btn}
              style={{flexDirection: 'row', marginRight: 30, alignItems: 'center'  }}
              onPress={()=>this.prePage()}
            >
              <Icon name="arrow-back" color={this.state.page === 1 ? '#b3cee9' : 'white'} size={ 20 } />
              <Text style={{color: this.state.page === 1 ? '#b3cee9' : 'white', fontSize: 16}}>{'Prev.'}</Text>
            </TouchableOpacity>
            <Text style={{color: 'white', fontSize: 16}}>{this.state.page}</Text>
            <TouchableOpacity
              disabled={this.state.page === this.state.pageCount}
              // style={this.state.page==this.state.pageCount?styles.btnDisable:styles.btn}
              style={{flexDirection: 'row', marginLeft: 30, alignItems: 'center' }}
              onPress={()=>this.nextPage()}
            >
              <Text style={{color: this.state.page === this.state.pageCount ? '#b3cee9' : 'white',  fontSize: 16}}>{'Next'}</Text>
              <Icon name="arrow-forward" color={this.state.page === this.state.pageCount  ? '#b3cee9' : 'white'} size={ 20 } />
            </TouchableOpacity>
          </View>
          <View style={styles.containerPdf}>
            <Pdf ref={(pdf)=>{this.pdf = pdf;}}
              source={this.source}
              page={1}
              scale={1}
              horizontal={false}
              onLoadComplete={(pageCount)=>{
                this.setState({pageCount: pageCount});
                console.log(`total page count: ${pageCount}`);
              }}
              onPageChanged={(page,pageCount)=>{
                this.setState({page, pageCount});
                console.log(`current page: ${page}`);
              }}
              onError={(error)=>{
                console.log(error);
              }}
              style={styles.pdf}/>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  pieceTitle: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 10,
  },
  pieceSubTitle: {
    color: '#8F8E94',
    fontSize: 13,
  },
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  thumbnailContainer: {
    flex: 1,
    marginRight: width > 320 ? 10 : 25,
  },
  notesThumbnail: {
    width: 75,
    height: 100,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  addButtonsContainer: {
    flex: 3,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#2497D0',
    borderRadius: 5,
    paddingVertical: 10,
    //paddingHorizontal: 5,
  },
  addButtonText: {
    fontSize: 17,
    color: 'white',
  },
  downloadButton: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2497D0',
    paddingVertical: 10,
    //paddingHorizontal: 5,
  },
  downloadButtonText: {
    fontSize: 17,
    color: '#2497D0',
  },
  pieceProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  pieceProgressItem: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  pieceProgressItemLast: {
    borderRightWidth: 0,
  },
  pieceProgressItemValue: {
    fontSize: 17,
    marginBottom: 5,
  },
  pieceProgressItemTitle: {
    fontSize: 13,
    color: '#8F8E94',
  },
  setGoalContainer: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  setGoalButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#979797',
    borderRadius: 5,
    paddingVertical: 10,
  },
  setGoalButtonText: {
    color: '#A8A8A8',
    fontSize: 17,

  },
  videosContainer: {
    marginBottom: 20,
  },
  videosTitleContainer: {
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  videosTitle: {
    color: '#6D6D72',
    fontSize: 13,
  },
  videos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  videosIconContainer: {
    paddingVertical: 10,
    paddingRight: 15,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  videosYoutubeIcon: {
    width: 50,
    height: 35,
  },
  videosScrollContainer: {
    justifyContent: 'space-between',
  },
  videosPreviewContainer: {
    marginLeft: 15,
  },
  videosPreviewIcon: {
    width: 75,
    height: 55,
  },
  getHelpContainer: {
    marginBottom: 45,
  },
  getHelpTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  getHelpTitle: {
    color: '#6D6D72',
    fontSize: 13,
  },
  getHelpLinkToAll: {
    color: '#2497D0',
    fontSize: 13,
  },
  getHelpItems: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  askButtonContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  askButton: {
    alignItems: 'center',
    backgroundColor: '#2497D0',
    borderRadius: 5,
    paddingVertical: 10,
  },
  askButtonText: {
    fontSize: 17,
    color: 'white',
  },
  removeButtonContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  removeButton: {
    alignItems: 'center',
  },
  removeButtonText: {
    paddingVertical: 10,
    color: '#EE2929',
    fontSize: 17,
  },
  containerPdf: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
  },
  clearIcon: {
    alignSelf: 'flex-start',
  },
});

function props(state, props){
  const newSerchResult = state.searchResult.list.results.filter(item => {
    if (item.id === props.route.idData) {
      return true;
    }
  });

  return {
    practice: state.practice,
    searchResult: newSerchResult[0],
  };
}

export default connect(props)(CustomPiece);
