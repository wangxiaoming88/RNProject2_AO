import React from 'react';
import {
  View,
  Text,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import PageTitle from '../../components/common/pageTitle';
import Tag from './tag';

import { baseStyles } from '../../components/styles';

import { connect } from 'react-redux';
import {createQuestion} from '../../redux/actions/searchResult';

const isIos = Platform.OS === 'ios';

class AskQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.data = props.route.data;
    this.state = {
      title: null,
      description: null,
      tags: null,
      data: {},
    };
  }

  handlePress = () => {
    this.props.dispatch(createQuestion(this.data.sheetMusic, this.state.title, this.state.description, this.props.user.username, this.data.dataId));

    this.props.navigator.pop();
  }
  
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
        <PageTitle
          title={ 'Ask a Question' }
          style={{ paddingLeft: 7 }}
          leftButtonText={ 'Cancel' }
          onLeftButton={ () => this.props.navigator.pop() }
        />
        <ScrollView showsVerticalScrollIndicator={ false }>
          <View style={[ baseStyles.content, baseStyles.contentL ]}>
            <View style={ styles.titleContainer }>
              <Text style={ styles.title }>
                TITLE
              </Text>
            </View>
            <View style={ styles.titleInputContainer }>
              <TextInput
                style={ styles.titleInput }
                multiline={ true }
                numberOfLines={ 3 }
                value={ this.state.title }
                onChangeText={ value => this.setState({ title: value }) }
              />
            </View>
            <View style={ styles.titleContainer }>
              <Text style={ styles.title }>
                DESCRIPTION
              </Text>
            </View>
            <View style={ styles.titleInputContainer }>
              <TextInput
                style={[ styles.titleInput, { height: 120 } ]}
                multiline={ true }
                numberOfLines={ 5 }
                value={ this.state.description }
                onChangeText={ value => this.setState({ description: value }) }
              />
            </View>
            <View style={ styles.titleContainer }>
              <Text style={ styles.title }>
                TAGS
              </Text>
            </View>
            <View style={ styles.tagsContainer }>
              <Tag
                tag={ 'Tag' }
              />
              <Tag
                tag={ 'Longtag' }
              />
              <Tag
                tag={ 'Shorttag' }
              />
              <Tag
                tag={ 'Tag' }
              />
              <Tag
                tag={ 'Tag' }
              />
              <Tag
                tag={ 'Tag' }
              />
            </View>
            <View style={ styles.askButtonContainer }>
              <TouchableOpacity  onPress={ this.handlePress }>
                <View style={ styles.askButton }>
                  <Text style={ styles.askButtonText }>
                    Submit Question
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 5,
  },
  title: {
    color: '#6D6D72',
    fontSize: 13,
  },
  titleInputContainer: {
    backgroundColor: 'white',
    borderColor: '#C8C7CC',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleInput: {
    height: isIos ? 40 : 60,
    margin: 15,
    marginBottom: isIos ? 15 : 10,
    backgroundColor: 'white',
    fontSize: 17,
    textAlignVertical: 'top',
  },
  tagsContainer: {
    padding: 15,
    paddingRight: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderColor: '#C8C7CC',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  askButtonContainer: {
    padding: 15,
    // paddingVertical: 50,
    marginBottom: 50,
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

function props(state){
  return {
    user: state.user,
  };
}

export default connect(props)(AskQuestion);
