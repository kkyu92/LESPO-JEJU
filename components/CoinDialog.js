import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Layout from '../constants/Layout';
import {
  GREY_COLOR,
  BG_COLOR,
  TINT_COLOR,
  GREY_COLOR3,
} from '../constants/Colors';
import Toast, {DURATION} from 'react-native-easy-toast';

export default class CoinDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Layout.width,
      height: Layout.height,
      battleResult: '',
      rating: 5,
      randomNum: '',
    };
    Dimensions.addEventListener('change', e => {
      this.setState(e.window);
    });
  }

  closeModal = data => {
    this.props.changeModalVisiblity(false);
    if (data === 'random') {
      this.createRandomNumber();
    } else {
      this.props.setData(data, this.state.rating);
    }
  };

  render() {
    return (
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
    );
  }
}

const styles = StyleSheet.create({
  img: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  imgMiniText: {
    color: GREY_COLOR3,
    fontSize: 12,
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  imgModal: {
    height: (Layout.height * 2) / 3.5,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
  },
  imgTitleView: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,
  },
  imgRandomBox: {
    marginTop: 20,
    width: 160,
    height: 244,
  },
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
  ratingModal: {
    height: (Layout.height * 2) / 3,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'center',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
  },
  titleView: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  ratingText: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
    // backgroundColor: 'royalblue',
  },
  imageBtnSelect: {
    width: 120,
    height: 120,
    backgroundColor: BG_COLOR,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  imageBtnUnSelect: {
    width: 120,
    height: 120,
    backgroundColor: TINT_COLOR,
    borderColor: BG_COLOR,
    borderWidth: 1,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  image: {
    width: 43,
    height: 40,
  },
  textSelect: {
    color: TINT_COLOR,
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  textUnSelect: {
    color: BG_COLOR,
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  ratingBtnView: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingContainer: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    // backgroundColor: 'royalblue',
  },
  ratingBtn: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
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
