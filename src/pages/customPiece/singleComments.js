import React from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TextInput,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import PageTitle from '../../components/common/pageTitle';
import Question from '../../components/customPiece/question';
import Answer from '../../components/customPiece/answer';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { createAnswer, filterAnswer, clearAnswer } from '../../redux/actions/answers';
import {fetchSheetmusicById} from '../../redux/actions/searchResult';

let { width, height } = Dimensions.get('window');

import { baseStyles } from '../../components/styles';

class SingleComments extends React.Component {
  constructor() {
    super();

    this.state = {
      // answers: [],
      description: '',
    };
  }

  componentWillMount() {
    this.props.dispatch(filterAnswer(this.props.route.questionId));
  }

  handlePress = () => {
    if (this.state.description.length  && this.state.description.length > 0) {
      this.props.dispatch(createAnswer(this.props.question.url, this.state.description, this.props.question.username, this.props.route.dataId, this.props.route.questionId));
      this.setState({description: ''});
    }
  }

  render() {
    const data = this.props.question;
    const answers = this.props.answers.list;

    // console.log('ANSWERS', answers);

    return (
      <View style={ baseStyles.container }>

        <PageTitle
          title={ 'Get Help' }
          iconLeft="navigate-before"
          leftButtonText={ 'Back' }
          onLeftButton={ () => {
            this.props.navigator.pop();
            this.props.dispatch(clearAnswer());
            this.props.dispatch(fetchSheetmusicById(this.props.route.dataId));
          }}
        />

        <ScrollView
          style={[ baseStyles.content, baseStyles.contentL ]}
          showsVerticalScrollIndicator={ false }
        >

          <Question
            data={ data }
            isQuestionPage={ true }
            dataId = { this.props.route.dataId }
          />

          <View style={ styles.answersTitleContainer }>
            <Text style={ styles.answersTitle }>
              ANSWERS
            </Text>
          </View>

          <View style={ styles.answersContainer }>
            {
              answers.results && answers.results.map(answer => {
                return (
                  <Answer
                    key={ answer.url }
                    data={ answer }
                  />
                );
              })
            }
          </View>

          <View style={ styles.typeAnswerContainer }>
            <View style={ styles.answerInputContainer }>
              <TextInput
                style={ styles.answerInput }
                multiline={ true }
                placeholder={ 'Type your answer…' }
                placeholderTextColor={ '#8F8E94' }
                underlineColorAndroid={ 'rgba(255, 255, 255, 0)' }
                value = {this.state.description}
                onChangeText={ value => this.setState({ description: value }) }
              />
            </View>
            <TouchableOpacity 
              style={ styles.submitContainer }
              onPress={ this.handlePress }
            >
              <View style={ styles.submitButton }>
                <Text style={ styles.submitButtonText }>
                  Submit
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </View>
    )
  }
}

SingleComments.defaultProps = {

};

const styles = StyleSheet.create({
  answersTitleContainer: {
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  answersTitle: {
    color: '#6D6D72',
    fontSize: 13,
  },
  answersContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
  },
  typeAnswerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C8C8CC',
    backgroundColor: 'white',
  },
  answerInputContainer: {
    flex: 2,
    marginRight: 20,
  },
  answerInput: {
    // flex: 1,
    alignItems: 'center',
    height: Platform.OS === 'android' ? 60 : 35,
    fontSize: 15,
    lineHeight: 20,
  },
  submitContainer: {
    flex: 1,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#2497D0',
    borderRadius: 5,
    padding: 10,
    //paddingHorizontal: 5,
  },
  submitButtonText: {
    fontSize: 17,
    color: 'white',
  },
});

function props(state, props){
  let newSerchResult = state.searchResult.list.results.filter(item => {
    if (item.id === props.route.dataId) {
      return true;
    }
  });

  newSerchResult = newSerchResult[0].questions.filter(item => {
    if (item.id === props.route.questionId) {
      return true;
    }
  });
  
  return {
    question: newSerchResult[0],
    answers: state.answers,
  };
}

export default connect(props)(SingleComments);
