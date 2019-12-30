import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Modal} from 'react-native';
import AlertPro from 'react-native-alert-pro';
import SimpleDialog from './SimpleDialog';

export default class AlertProDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      choosenData: '',
    };
  }

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  setData = data => {
    this.setState({choosenData: data});
  };

  render() {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.text}>{this.state.choosenData}</Text>
        <TouchableHighlight
          onPress={() => this.changeModalVisiblity(true)}
          style={[styles.touchableHighlight, {backgroundColor: 'orange'}]}
          underlayColor={'#f1f1f1'}>
          <Text style={styles.text}> Open Modal </Text>
        </TouchableHighlight>
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  touchableHighlight: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});
