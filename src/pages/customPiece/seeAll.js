import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import PageTitle from '../../components/common/pageTitle';
import Question from '../../components/customPiece/question';
import { connect } from 'react-redux';

// import {fetchSheetmusicById} from '../../redux/actions/searchResult';

import { baseStyles } from '../../components/styles';

class SeeAll extends React.Component {
  handlePress = () => {
    let data = {
      'sheetMusic' : this.props.route.sheetMusic,
      'dataId' : this.props.route.dataId,
    };
    this.props.navigator.push({ id: 'askQuestion', data });
  }


  render() {
    const { questions } = this.props;

    return (
      <View style={ baseStyles.container }>

        <PageTitle
          title={ 'Get Help' }
          iconLeft="navigate-before"
          leftButtonText={ 'Back' }
          onLeftButton={ () => this.props.navigator.pop() }
        />

        <ScrollView
          style={[ baseStyles.content, baseStyles.contentL ]}
          showsVerticalScrollIndicator={ false }
        >
          <View style={ styles.getHelpItems }>
            {
              questions.map(_question => {
                return (
                  <Question
                    key={_question.id}
                    data={ _question }
                    navigator={ this.props.navigator }
                    isQuestionPage={ false }
                    dataId = { this.props.route.dataId }
                  />
                );
              })
            }
          </View>

          <View style={ styles.askButtonContainer }>
            <TouchableOpacity onPress={ this.handlePress }>
              <View style={ styles.askButton }>
                <Text style={ styles.askButtonText }>
                  Ask a Question
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});

function props(state, props){
  let newSerchResult = state.searchResult.list.results.filter(item => {
    if (item.id === props.route.dataId) {
      return true;
    }
  });
  return {
    questions: newSerchResult[0].questions,
  };
}

export default connect(props)(SeeAll);
