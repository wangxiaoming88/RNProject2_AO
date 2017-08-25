import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import { connect } from 'react-redux';

import {upvoteQuestion} from '../../redux/actions/searchResult';

let { width, height } = Dimensions.get('window');

class Question extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: this.props.data.rating
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rating: nextProps.data.rating
    });
  }

  _handleQuestionAnswerPress = () => {
    // console.log('NO');
    if (this.props.isQuestionPage) { return }
    this.props.navigator.push({ id: 'singleComments', dataId: this.props.dataId, questionId: this.props.data.id});
    // console.log('TES');
  };

  _getDescription = () => {
    if (this.props.isQuestionPage) {
      return (
        <View style={ styles.itemDescriptionContainer }>
          <Text style={ styles.itemDescription }>
            { this.props.data.description }
          </Text>
        </View>
      )
    }
  };

  handlePress = () => {
    const data = this.props.data;

    this.props.upvoteQuestion(data.url, data.username, this.props.dataId, data.id);
  }

  render() {
    let { data, isQuestionPage } = this.props;
    // console.log('fgfgf', data, isQuestion);

    return (
      <View style={[ styles.getHelpContainer, { marginBottom: isQuestionPage ? 20 : 0 } ]}>
        <View style={ styles.getHelpItem }>
          <TouchableOpacity
            style={ styles.likesTouchContainer }
            onPress={ this.handlePress }
          >
            <View style={ styles.likesContainer }>
              <Image
                source={ require('../../../images/like-icon.png') }
                style={ styles.likesIcon }
              />
              <Text style={ styles.likesCount }>
                { this.state.rating }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ this._handleQuestionAnswerPress }
            style={ styles.questionTouchContainer }
          >
            <View style={ styles.questionContainer }>
              <Text style={ styles.question }>
                { data.title }
              </Text>
              <View style={ styles.questionAttributes }>
                <Text style={ styles.questionAttribute }>
                  {
                    isQuestionPage
                      ? data.username
                      : `${ data.total_answers } answers`
                  }
                </Text>
                <View style={ styles.questionAttributeIcon }>
                  <Icon name={ 'fiber-manual-record' } size={ 7 } color={ '#8F8E94' } />
                </View>
                <Text style={ styles.questionAttribute }>
                  { moment(data.created_date).fromNow() }
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        { this._getDescription() }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  getHelpContainer: {},
  getHelpItem: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  likesTouchContainer: {
    flex: 1,
  },
  likesContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#F9F9FB',
  },
  likesIcon: {
    width: 21,
    height: 21,
  },
  upIcon: {
    width: 13,
    height: 8,
    marginBottom: 5,
  },
  likesCount: {
    color: '#8F8E94',
    fontSize: 13,
    lineHeight: 18,
  },
  questionTouchContainer: {
    flex: 5,
    backgroundColor: 'white',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  questionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  question: {
    color: 'black',
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 5,
  },
  questionAttributes: {
    flexDirection: 'row',
  },
  questionAttribute: {
    color: '#8F8E94',
    fontSize: 13,
  },
  questionAttributeIcon: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  itemDescriptionContainer: {
    width,
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  itemDescription: {
    color: '#808085',
    fontSize: 15,
    lineHeight: 20,
  },
});

export default connect(null, {upvoteQuestion})(Question);
