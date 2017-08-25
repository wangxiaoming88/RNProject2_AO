import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  InteractionManager,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';

import moment from 'moment';

var ViewPager = require('react-native-viewpager');

import { TabViewAnimated, TabBarTop, TabBar } from 'react-native-tab-view';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import CustomTabBar from './customTabBar';

import PageSwitcher from '../joinNewClass/pageSwitcher';

import { baseStyles } from '../styles';

const weekLabels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const monthLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
// const charts = [
//     <View style={styles.chart}>
//       { this.genBars(maxValue) }
//     </View>
//     ,
//     <View style={styles.chart}>
//       { this.genBars(maxValue) }
//     </View>
// ];

  const date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var firstDay = new Date(y, m, 1);
  var lastDay = new Date(y, m + 1, 0);

  firstDay = moment(firstDay).format('MMM D');
  lastDay = moment(lastDay).format('MMM D');

class PracticeProgressBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: weekLabels.map((item) => new Animated.Value(0)),
      monthValues: monthLabels.map((item) => new Animated.Value(0)),
      activeTab: 0,
      weekLabels: weekLabels,
      navigationState: {
        index: 0,
        routes: [
          { key: '1' },
          { key: '2' },
        ],
      },
    };
  }

  // navigationState = {
  //   index: 0,
  //   routes: [
  //     { key: '1', title: 'First' },
  //     { key: '2', title: 'Second' },
  //   ],
  // };

  _capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  componentWillReceiveProps(props) {
    //console.log('bars', props);
    if (props.status === 'fetched') {
      this.dataLoadComplete(props);
    }
  }

  dataLoadComplete(props) {
    /*let startDateWeekDay = new Date(props.datasets.start_date).getDay();

    this.setState({
      weekLabels: [
        ...weekLabels.slice(startDateWeekDay),
        ...weekLabels.slice(0, startDateWeekDay)
      ]
    });*/
    this.setState({
      values: props.datasets.values.map((item) => new Animated.Value(0)),
      monthValues: props.monthDatasets.values.map((item) => new Animated.Value(0))
    });
    InteractionManager.runAfterInteractions(() => {
      Animated.parallel(props.datasets.values.map((item, i) => {
        return Animated.spring(
          this.state.values[i],
          {toValue: item}
        );
      })).start();
    });
    InteractionManager.runAfterInteractions(() => {
      Animated.parallel(props.monthDatasets.values.map((item, i) => {
        return Animated.spring(
          this.state.monthValues[i],
          {toValue: item}
        );
      })).start();
    });
  }

  changeActiveTab(tabId) {
    this.setState({activeTab: tabId});
  }

  genWeekBars(maxValue) {

    return this.props.datasets.values.map((item, i) => {
      if (!this.state.values[i]) {
        return;
      }
      return (
        <View key={ i } style={ styles.barWrapper }>
          <Animated.View style={[ styles.bar,
            {
              height: this.state.values[i].interpolate({
                inputRange: [0, maxValue],
                outputRange: [0, 100]
              }),
              backgroundColor: item ? '#2392ca' : '#C8C7CC',
              borderColor: item ? '#2392ca' : '#C8C7CC',
            } ]}
          />
          <Text style={ styles.labelText }>{ this._capitalizeFirstLetter(this.state.weekLabels[i]) }</Text>
          <View style={ styles.value }>
            <Text style={ styles.valueText }>
              { item }
            </Text>
          </View>
        </View>
      );
    });
  }

  genMonthBars(maxValue) {
    // console.log('INTERPOLATE', this.props.monthDatasets, this.state.monthValues);
    // { this._capitalizeFirstLetter(this.state.weekLabels[i]) }
          //     <Text style={ styles.labelText }></Text> 
          // <View style={ styles.value }>
          //   <Text style={ styles.valueText }>
          //     { item }
          //   </Text>
          // </View>
    // console.log('datasets', this.props.datasets.values);
    // let newArray = this.props.datasets.values.concat(monthLabels);
    // console.log('datasets2', newArray);
    return this.props.monthDatasets.values.map((item, i) => {
      if (!this.state.monthValues[i]) {
        return;
      }
      return (
        <View key={ i } style={ styles.monthBarWrapper }>
          <Animated.View style={[ styles.monthBar,
            {
              height: this.state.monthValues[i].interpolate({
                inputRange: [0, maxValue],
                outputRange: [0, 100]
              }),
              backgroundColor: item ? '#2392ca' : '#C8C7CC',
              borderColor: item ? '#2392ca' : '#C8C7CC',
            } ]}
          />
        </View>
      );
    });
  }

  sumValues(array) {
    let hour = 60;
    let sum = 0;

    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }

    if (sum >= hour) {
      return `${ Math.round((sum / hour) * 10) / 10 } hour`
    } else {
      return `${ sum } min`
    }
  }

  _handleChangeTab = (index) => {
    this.setState({ navigationState: {...this.state.navigationState, index} });
  };

  _renderScene = ({ route }) => {
    let maxValue = Math.max(...this.props.datasets.values);
    let maxMonthValue = Math.max(...this.props.monthDatasets.values);
    // console.log('MAX_VALUES', maxValue, maxMonthValue);
    switch (route.key) {
    case '1':
      return  <View
                style={ [styles.chartContainer, baseStyles.centeredContainer] }
              >
                <View style={ {width: Dimensions.get('window').width > 400 ? 400 :  Dimensions.get('window').width } }>
                  <View
                    style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        fontSize: 26,
                        color: '#6D6D72',
                      }}
                    >
                      {this.sumValues(this.props.datasets.values)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#8F8E94',
                      }}
                    >
                      This week
                    </Text>
                  </View>
                  <View style={styles.chart}>
                    {
                     this.genWeekBars(maxValue)
                   }
                  </View>
                </View>
              </View>;
    case '2':
      return  <View style={ [styles.chartContainer, baseStyles.centeredContainer] }>
                <View style={ {width: Dimensions.get('window').width > 400 ? 400 :  Dimensions.get('window').width } }>
                  <View
                    style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        fontSize: 26,
                        color: '#6D6D72',
                      }}
                    >
                      {this.sumValues(this.props.monthDatasets.values)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#8F8E94',
                      }}
                    >
                      This month
                    </Text>
                  </View>
                  <View style={styles.monthChart}>
                    {
                      this.genMonthBars(maxMonthValue)
                    }
                  </View>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10}}
                  >
                    <Text
                      style={ styles.labelText }
                    >
                      Oct 1
                    </Text>
                    <Text
                      style={ styles.labelText }
                    >
                      Oct 31
                    </Text>
                  </View>
                </View>
              </View>;
    default:
      return null;
    }
  };

  // _renderHeader = (props) => {
  //   return <TabBarTop {...props} />;
  // };

  _renderFooter = (props) => {
    // console.log('tabbar props', props.navigationState.index);
    return <TabBar
      tabStyle={{      
        backgroundColor: 'rgba(0,0,0,0.56)',
        borderRadius: 10,
        marginLeft: 10,
      }}
      style={{
        borderWidth: 0,
        backgroundColor: '#EFEFF4',
        flexDirection: 'row',
        justifyContent: 'center', // (props.navigationState.index === 0) ? 'flex-end' : 'flex-start',
      }}
      {...props}
    />;
  };

  render() {
    let maxValue = Math.max(...this.props.datasets.values);
    let maxMonthValue = Math.max(...this.props.monthDatasets.values);
    // console.log('MAX_VALUES', maxValue, maxMonthValue);
    // console.log('VALUESSS', this.props.datasets);
    return (
      (Platform.OS === 'ios')
      ?
        <ScrollableTabView
          // style={ [styles.chartContainer, baseStyles.centeredContainer] }
          tabBarPosition={'bottom'}
          tabsContainerStyle={{ flex: 1 }}
          tabBarUnderlineStyle={{ backgroundColor: 'transparent', tintColor: 'transparent'}}
          renderTabBar={() => <CustomTabBar
            tabStyle={{justifyContent: 'flex-start', backgroundColor: 'white'}}
            activeTextColor={'rgba(0,0,0,0.56)'}
            inactiveTextColor={'rgba(0,0,0,0.24)'}
            textStyle={{ width: 8, height: 8, borderRadius: 4}}
            underlineHeight={0}
          />}
        >
          <View style={ [styles.chartContainer, baseStyles.centeredContainer, { backgroundColor: 'white' }] }>
            <View style={ {width: Dimensions.get('window').width > 400 ? 400 :  Dimensions.get('window').width } }>
              <View
                style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    color: '#6D6D72',
                  }}
                >
                  {this.sumValues(this.props.datasets.values)}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#8F8E94',
                  }}
                >
                  This week
                </Text>
              </View>
              <View style={styles.chart}>
                { this.genWeekBars(maxValue) }
              </View>
            </View>
          </View>

          <View style={ [styles.chartContainer, baseStyles.centeredContainer, { backgroundColor: 'white' }] }>
            <View style={ {width: Dimensions.get('window').width > 400 ? 400 :  Dimensions.get('window').width } }>
              <View
                style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    color: '#6D6D72',
                  }}
                >
                  {this.sumValues(this.props.monthDatasets.values)}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#8F8E94',
                  }}
                >
                  This month
                </Text>
              </View>
              <View style={styles.monthChart}>
                { this.genMonthBars(maxMonthValue) }
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10}}
              >
                <Text
                  style={ styles.labelText }
                >
                  {firstDay.toString()}
                </Text>
                <Text
                  style={ styles.labelText }
                >
                  {lastDay.toString()}
                </Text>
              </View>
            </View>
          </View>
        </ScrollableTabView>
      :
        <TabViewAnimated
          style={{ flex: 1 }}
          navigationState={this.state.navigationState}
          renderScene={this._renderScene}
          //renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          onRequestChangeTab={this._handleChangeTab}
        />
    );
  }
}

let styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    //height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 14,
    paddingTop: 28
  },
  chart: {
    height: 170,
    //backgroundColor: 'black',
    alignSelf: 'stretch',
    // alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  barWrapper: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    //backgroundColor: 'blue',
    width: 30,
  },
  bar: {
    // backgroundColor: 'red',
    padding: 5,
    width: 11,
    // backgroundColor: '#2392ca',
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    // borderColor: '#1e80b0'
  },
  monthBar: {
    padding: 2,
    width: 4,
    // backgroundColor: '#2392ca',
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: 'solid',
    // borderColor: '#1e80b0'
  },
  monthBarWrapper: {
    flex: 1,
    margin: 4,
    alignItems: 'center',
    //backgroundColor: 'blue',
  },
  monthChart: {
    height: 130,
    //backgroundColor: 'black',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  value: {
    //backgroundColor: 'green',
    padding: 5
  },
  valueText: {
    //backgroundColor: 'red',
    color: '#8F8E94',
    textAlign: 'center'
  },
  labels: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    paddingTop: 10,
    fontSize: 12,
    //textAlign: '',
    color: '#259ad5'
  }
});

export default PracticeProgressBlock;

    //       <View style={ [styles.chartContainer, baseStyles.centeredContainer] }>
    //         <View style={ {width: Dimensions.get('window').width > 400 ? 400 :  Dimensions.get('window').width } }>
    // {/*          <PageSwitcher
    //             light
    //             onChange={ this.changeActiveTab.bind(this) }
    //             activeTab={ this.state.activeTab }
    //             tabs={ ['This Week\'s Progress', 'All Time Progress'] }
    //             style={{
    //               switcherButton: {padding: 5},
    //               switcherButtonText: {fontSize: (Dimensions.get('window').width === 320) ? 12 : 13}
    //             }} />*/}
    //             <View style={styles.chart}>
    //               { this.genBars(maxValue) }
    //             </View>
    // {/*          <View style={ styles.labels }>
    //             { this.state.weekLabels.map((item, i) => {
    //               return (
    //                 <View key={ i } style={ styles.barWrapper }>
    //                   <Text style={ styles.labelText }>{ this._capitalizeFirstLetter(item) }</Text>
    //                 </View>
    //               );
    //             })}
    //           </View>*/}
    //         </View>
    //       </View>
