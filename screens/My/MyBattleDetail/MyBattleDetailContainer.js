import React from 'react';
import {Modal, Platform} from 'react-native';
import SimpleDialog from '../../../components/SimpleDialog';
import MyBattleDetailPresenter from './MyBattleDetailPresenter';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

var M_ID, M_NAME, M_PROFILE;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const {
      navigation: {
        state: {
          params: {
            roomKey,
            id,
            profile,
            name,
            sport,
            type,
            date,
            area,
            memo,
            statusText,
            level,
          },
        },
      },
    } = props;
    this.state = {
      loading: true,
      roomKey,
      id,
      profile,
      name,
      sport,
      type,
      date,
      area,
      memo,
      statusText,
      level,
      myId: '',
      myName: '',
      myProfile: '',
      isModalVisible: false,
      roomMaker: '',
      error: null,
      navigation,
    };
    console.log('room ID :' + JSON.stringify(roomKey));
    console.log('user ID :' + JSON.stringify(id));
  }

  getData = async () => {
    console.log('getData');
    try {
      M_ID = await AsyncStorage.getItem('@USER_ID');
      M_NAME = await AsyncStorage.getItem('@USER_NAME');
      M_PROFILE = await AsyncStorage.getItem('@USER_PROFILE');
      if (M_PROFILE !== null || M_PROFILE !== '') {
        this.setState({
          myId: M_ID,
          myName: M_NAME,
          myProfile: M_PROFILE,
        });
      } else {
        console.log('Login profile image null');
      }
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

  // 시작시 불러옴
  async componentDidMount() {
    let {roomKey} = this.state;
    let maker;
    try {
      this.getData();
      var userRef = firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/makeUser/userId/');
      userRef.once('value', dataSnapshot => {
        maker = JSON.stringify(dataSnapshot);
        this.setState({
          roomMaker: maker,
          loading: false,
        });
      });
    } catch (error) {
      console.log(error);
      error = "Cnat't get TV";
    }
  }

  battleState = state => {
    console.log('battleState: ' + state);
  };

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  setData = data => {
    const {myId, roomMaker} = this.state;
    console.log('setData::: ', data);
    if (data === 'battleCancel') {
      // this.props.navigation.navigate({routeName: 'Login'});
      // 배틀 취소 [ 방장 / 참여자 ]
      if (JSON.stringify(myId) === roomMaker) {
        console.log('i am roomMaker');
        this.deleteChatRoom();
      } else {
        console.log('i am joinUser');
        this.outChatRoom();
      }
    } else if (data === 'battleRating') {
      // 배틀 평가하기
    } else {
      // Dialog 취소
    }
  };

  // 방장이 나간다
  deleteChatRoom = async () => {
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey)
      .remove()
      .then(data => {
        //success callback
        console.log('chatRoom Out: ', data);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
    this.props.navigation.goBack(null);
  };

  // 참여자가 나간다
  outChatRoom = async () => {
    let chatList = '';
    let joinUser = {
      userId: '',
      userName: '',
      userProfile: '',
      userRating: '',
    };
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey)
      .update({
        date: moment().format(),
        chatList,
        joinUser,
      })
      .then(data => {
        //success callback
        console.log('joinUser Out: ', data);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
    this.props.navigation.goBack(null);
  };

  componentWillUnmount() {
    // firebase
    //   .database()
    //   .ref('chatRoomList/')
    //   .off();
  }

  render() {
    const {
      loading,
      sport,
      type,
      date,
      area,
      memo,
      statusText,
      level,
      chatRoomList,
      myId,
      myName,
      myProfile,
      name,
      id,
      profile,
      roomKey,
      roomMaker,
    } = this.state;
    return (
      <>
        <MyBattleDetailPresenter
          loading={loading}
          sport={sport}
          type={type}
          date={date}
          area={area}
          memo={memo}
          statusText={statusText}
          level={level}
          chatRoomList={chatRoomList}
          myId={myId}
          myProfile={myProfile}
          myName={myName}
          id={id}
          profile={profile}
          name={name}
          roomKey={roomKey}
          roomMaker={roomMaker}
          changeModalVisiblity={this.changeModalVisiblity}
        />
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            battleState={statusText}
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
      </>
    );
  }
}
