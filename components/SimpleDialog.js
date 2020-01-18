import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Layout from '../constants/Layout';
import {GREY_COLOR} from '../constants/Colors';

export default class SimpleDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Layout.width,
      height: Layout.height,
    };
    Dimensions.addEventListener('change', e => {
      this.setState(e.window);
    });
  }

  closeModal = data => {
    this.props.changeModalVisiblity(false);
    this.props.setData(data);
  };

  render() {
    return this.props.battleState === null ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.modal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              로그아웃 하시겠습니까?
            </Text>
            {/* <Text style={styles.text}> Modal Text </Text> */}
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 취소 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('OK')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 로그아웃 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.props.battleState === '배틀시작' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.battleStartModal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              배틀신청
            </Text>
            <Text style={styles.text}>
              배틀을 신청 하시겠습니까?
              {'\n'}
              배틀코인 1개가 차감 됩니다.
            </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 아니요 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('battleStart')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 예 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : this.props.battleState === '배틀신청중' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={true}
        style={styles.contentContainer}>
        <View style={[styles.battleModal, {width: this.state.width - 80}]}>
          <View style={styles.textView}>
            <Text style={[styles.text, {color: 'black'}, {fontSize: 20}]}>
              배틀신청 취소
            </Text>
            <Text style={styles.text}> 배틀신청을 취소 하시겠습니까? </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight
              onPress={() => this.closeModal('Cancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'red'}]}> 아니요 </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.closeModal('battleCancel')}
              style={styles.touchableHighlight}
              underlayColor={'#f1f1f1'}>
              <Text style={[styles.text, {color: 'orange'}]}> 예 </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      console.log('this.props.battleState: ' + this.props.battleState)
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    height: Layout.height / 6,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
  },
  battleModal: {
    height: Layout.height / 5,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
  },
  battleStartModal: {
    height: Layout.height / 4.5,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    margin: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  touchableHighlight: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 10,
  },
  textView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    // borderTopWidth: 1,
    // borderColor: GREY_COLOR,
  },
});
