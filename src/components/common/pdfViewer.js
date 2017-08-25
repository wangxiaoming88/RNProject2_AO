import React, { Component } from 'react';
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

class PdfViewer extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {};
  }

  render() {
    return (
      <View>
        <PageTitle
            iconLeft="clear"
            onLeftButton={ () => this.setState({modalVisible: false}) }
            title={this.data.title}
          />
          <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1b97d3', paddingBottom: 10}}>
            <TouchableOpacity
              disabled={this.state.page === 1}
              style={{flexDirection: 'row', marginRight: 30, alignItems: 'center'  }}
              onPress={()=>this.prePage()}
            >
              <Icon name="arrow-back" color={this.state.page === 1 ? '#b3cee9' : 'white'} size={ 20 } />
              <Text style={{color: this.state.page === 1 ? '#b3cee9' : 'white', fontSize: 16}}>{'Prev.'}</Text>
            </TouchableOpacity>
            <Text style={{color: 'white', fontSize: 16}}>{this.state.page}</Text>
            <TouchableOpacity
              disabled={this.state.page === this.state.pageCount}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

export default PdfViewer;
