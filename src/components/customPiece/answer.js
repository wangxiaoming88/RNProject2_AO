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

import {upvoteAnswer} from '../../redux/actions/answers';

let { width, height } = Dimensions.get('window');

class Answer extends React.Component {
  // constructor(props) {
  //   super(props);
  
  //   this.state = {
  //     rating: props.data.rating,
  //   };
  // }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     rating: nextProps.data.rating,
  //   });
  // }

  handlePress = () => {
    const data = this.props.data;

    this.props.upvoteAnswer(data.url, data.username, data.id);
  }

  render() {
    let { data } = this.props;
    // console.log('fgfgf', data, isQuestion);
    return (
      <View style={ styles.getHelpContainer }>
        <View style={ styles.getHelpItem }>
          <TouchableOpacity 
            style={ styles.likesTouchContainer }
            onPress={ this.handlePress }
          >
            <View style={ styles.likesContainer }>
              <Image
                source={ require('../../../images/up.png') }
                style={ styles.upIcon }
              />
              <Text style={ styles.likesCount }>
                { data.rating }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={ this._handleQuestionAnswerPress }
            style={ styles.questionTouchContainer }
          >
            <View style={ styles.questionContainer }>
              <Text style={ styles.question }
              >
                { data.description }
              </Text>
              <View style={ styles.questionAttributes }>
                <Text style={ styles.questionAttribute }>
                  { data.username }
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
      </View>
    );
  }
}

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
    color: 'gray',
    fontSize: 15,
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

export default connect(null, {upvoteAnswer})(Answer);

