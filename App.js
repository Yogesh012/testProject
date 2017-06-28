import React from 'react';
import { StyleSheet, Text, View, FlatList, Alert, TouchableNativeFeedback, Modal, Button, TouchableOpacity, ActivityIndicator } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      lastpage: false
    };
  }

  componentDidMount() {
    if(!this.state.lastpage){
      this.makeDataRequest()
    }

  }
  loadmore = () => {
    if(!this.state.lastpage){
      this.setState({ loading: true });
      this.makeDataRequest()
    }
  }

  makeDataRequest = function(){

    this.setState({ loading: true });
    return fetch('http://demo.altiorecapital.com/api/financial/?page_number=' + this.state.page)
      .then((response) => response.json())
      .then((res) => {

        var dataSet = [];
        Object.keys(res.Financial_dataset.values).map((key, index) => {

          if(key != '_figure'){
            dataSet.push(res.Financial_dataset.values[key])
          }

        })

        this.setState( (prevState) => ({
          data: prevState.data.concat(dataSet),
          page: prevState.page + 1,
          loading: false,
          refreshing: false,
          lastpage: res.last_page
        }));

      })
      .catch((error) => {
        this.setState({ error, loading: false });
        console.error(error);
      });
  }


  renderFooter = () => {
    if (this.state.lastpage) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  _keyExtractor = (item, index) => index;

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "99%",
          backgroundColor: "#CED0CE",
          marginLeft: "1%"
        }}
      />
    );
  };

  render() {

    return (
        <View style={styles.container}>
            <FlatList data={this.state.data}
                      ListHeaderComponent={ListHeader}
                      ListFooterComponent={this.renderFooter}
                      ItemSeparatorComponent={this.renderSeparator}
                      renderItem={({item}) => <ListItem data={item}/>}
                      onEndReached={this.loadmore}
                      keyExtractor={this._keyExtractor} />

        </View>
    );
  }
}

class ListHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(

      <View style={styles.header}>
         <Text style={[styles.headerText, {flex: 2, textAlign: 'left'}]}>Scheme Name</Text>
         <Text style={styles.headerText}>Current Value</Text>
         <Text style={[styles.headerText, {textAlign: 'right'}]}>XIRR</Text>
      </View>

    )
  }
}

class ListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {modalVisibility: false,
                  transparent: true
                }
    //console.log("list item props: ", this.props.data._fig
  }
  _onPressItem = () => {
    this.setState((previousState) => ({
      modalVisibility: !previousState.modalVisibility
    }))
    };
  render() {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.8)' : '#f5fcff'
    };
    var innerContainerTransparentStyle = this.state.transparent ? {backgroundColor: '#fff', padding: 20} : null;

    return(
      <View>
          <Modal animationType={"fade"} transparent={true} visible={this.state.modalVisibility} onRequestClose={this._onPressItem}>
              <View style={[styles.container, modalBackgroundStyle]}>
                  <View style={[styles.innerContainer, innerContainerTransparentStyle]}>

                      <View>
                          <View>
                              <Text style={styles.modalHeading}>{this.props.data._figure[0]}</Text>
                          </View>
                          <View style={styles.modalSubHeading}>
                            <Text style={[styles.listItemDetails, {textAlign: 'left', fontSize: 13, flex: 0.4}]}>{this.props.data._figure[1]}</Text>
                            <Text style={[styles.listItemDetails, {textAlign: 'center', fontSize: 13, flex: 0.5}]}>{this.props.data._figure[12]}</Text>
                            <Text style={[styles.listItemDetails, {textAlign: 'center', fontSize: 13, flex: 1}]}>{this.props.data._figure[14].toFixed(0)} Units</Text>
                          </View>
                      </View>

                      <View style={styles.modalBody}>
                          <View style={{flex: 1}}>
                              <View style={styles.modalBodySmallContainer}>
                                  <Text style={styles.modalBodyDetails}>Current Value</Text>
                                  <Text style={[styles.modalBodyRightPane, {textAlign: 'left', color: 'green'}]}>Rs {this.props.data._figure[5].toFixed(2)}</Text>
                              </View>
                              <View style={styles.modalBodySmallContainer}>
                                  <Text style={styles.modalBodyDetails}>Total Gain</Text>
                                  <Text style={[styles.modalBodyRightPane, {textAlign: 'left', color:'green'}]}>Rs {this.props.data._figure[9].toFixed(2)}</Text>
                              </View>
                              <View style={[styles.modalBodySmallContainer, {flexDirection:'row'}]}>
                                  <View style={{flex: 1}}>
                                      <Text style={styles.modalBodyDetails}>Gain%</Text>
                                      <Text style={[styles.modalBodyRightPane, {textAlign: 'left', color: 'orange'}]}>{Math.abs(this.props.data._figure[10]).toFixed(2)}%</Text>
                                  </View>
                                  <View style={{flex: 1}}>
                                      <Text style={styles.modalBodyDetails}>XIRR</Text>
                                      <Text style={[styles.modalBodyRightPane, {textAlign: 'left',color: 'orange'}]}>{Math.abs(this.props.data._figure[11]).toFixed(2)}%</Text>
                                  </View>
                              </View>
                              <View style={styles.modalBodySmallContainer}>
                                  <Text style={styles.modalBodyDetails}>Purchase Date</Text>
                                  <Text style={[styles.modalBodyRightPane, {textAlign: 'left'}]}>{this.props.data._figure[15]}</Text>
                              </View>
                          </View>

                          <View style={{flex: 1}}>
                          <View style={styles.modalBodySmallContainer}>
                              <Text style={[styles.modalBodyDetails, {textAlign:'right'}]}>Cost Value</Text>
                              <Text style={styles.modalBodyRightPane}>Rs {this.props.data._figure[4].toFixed(2)}</Text>
                          </View>
                          <View style={styles.modalBodySmallContainer}>
                              <Text style={[styles.modalBodyDetails, {textAlign:'right'}]}>Unrealised Gain</Text>
                              <Text style={styles.modalBodyRightPane}>Rs {this.props.data._figure[8].toFixed(2)}</Text>
                          </View>
                          <View style={styles.modalBodySmallContainer}>
                              <Text style={[styles.modalBodyDetails, {textAlign:'right'}]}>Dividend</Text>
                              <Text style={styles.modalBodyRightPane}>{Math.abs(this.props.data._figure[7]).toFixed(2)}</Text>
                          </View>
                          <View style={styles.modalBodySmallContainer}>
                              <Text style={[styles.modalBodyDetails, {textAlign:'right'}]}>Maturity Date</Text>
                              <Text style={styles.modalBodyRightPane}>{this.props.data._figure[16]}</Text>
                          </View>
                          </View>
                      </View>

                      <View style={styles.modalFooter}>
                          <Text style={{color: '#ffffff'}}>See Scheme Details</Text>
                      </View>
                  </View>


                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={styles.modalButton} onPress={this._onPressItem}>
                        <Text style={{color: '#ffffff'}}>X</Text>
                    </TouchableOpacity>
                  </View>
              </View>
          </Modal>


          <TouchableNativeFeedback onPress={this._onPressItem}>
              <View style={styles.listItemContainer}>
                  <View style={styles.listItem}>
                     <Text style={styles.listItemName}>{this.props.data._figure[0]}</Text>
                     <Text style={styles.listItemValue}>Rs {this.props.data._figure[5].toFixed(2)}</Text>
                     <Text style={styles.listItemRate}>{Math.abs(this.props.data._figure[11]).toFixed(2)}%</Text>
                  </View>

                  <View style={styles.listItem}>
                     <View style={{flex:0.3}}></View>
                     <View style={styles.listItem}>
                         <Text style={styles.listItemDetails}>{this.props.data._figure[1]}</Text>
                         <Text style={styles.listItemDetails}>{this.props.data._figure[12]}</Text>
                         <Text style={styles.listItemDetails}>{this.props.data._figure[14].toFixed(0)} Units</Text>
                     </View>
                  </View>
              </View>
          </TouchableNativeFeedback>
      </View>
    )
  }
}


class DetailsModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
          <Modal animationType={"fade"} transparent={true}> {this.props.name} </Modal>
      </View>
    )
  }
}
//Custom Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-around'
  },
  innerContainer: {
    borderWidth: 1.0,
    borderColor: '#d6d7da',
    borderRadius: 10,
    justifyContent: 'space-between'
  },

  header: {
    paddingTop: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  headerText: {
    flex: 1,
    color: '#02a9ff',
    fontSize: 15,
    textAlign: 'center'
  },

  listItemContainer: {
    flex: 1,
    height: 75,
    marginBottom: 10,
    //elevation: 2,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  listItemName: {
    flex: 2,
    color: 'black',
    fontSize: 12,
    textAlign: 'left',
    fontWeight: 'bold'
  },
  listItemValue: {
    flex: 1,
    color: 'green',
    fontSize: 12,
    textAlign: 'right'
  },
  listItemRate: {
    flex: 1,
    color: 'orange',
    fontSize: 12,
    textAlign: 'right'
  },
  listItemDetails: {
    color: 'grey',
    fontSize: 10,
    textAlign: 'right',
    flex: 1
  },

  modalButton: {
    borderWidth: 0.5,
    borderRadius: 50,
    borderColor: "#ffffff",
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50
  },
  modalButtonText: {
    borderRadius: 5,
    borderWidth:0.5,
    borderColor: "#ffffff",
    color:"#ffffff",
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalHeading: {
    color: 'black',
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold'
  },
  modalSubHeading: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  modalBody: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  modalBodyDetails: {
    color: 'grey',
    fontSize: 10,
    textAlign: 'left',
  },
  modalBodySmallContainer: {
    paddingVertical: 10
  },
  modalBodyRightPane: {
    color: '#02a9ff',
    fontSize: 20,
    textAlign: 'right'
  },
  modalFooter:{
    backgroundColor: '#02a9ff',
    marginBottom: -21,
    marginLeft: -21,
    marginRight: -21,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
