import React from 'react';
import {Platform, Alert} from 'react-native';
import MyBattlePresenter from './MyBattlePresenter';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';
import Firebase from 'react-native-firebase';
import {
  CHAT_ROOM_IN,
  DELETE_UPDATE,
  ROOM_OUT,
} from '../../../constants/Strings';

var M_ID, M_NAME, M_PROFILE;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      chatRoomList: [],
      myId: '',
      myName: '',
      myProfile: '',
      navigation,
      error: null,
    };
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
      alert('getData [MyBattle] ::: ' + e);
    }
  };

  // 시작시 불러옴
  async componentDidMount() {
    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      // 화면에 들어와있을 때 알림
      this.removeToastListener = Firebase.notifications().onNotification(
        notification => {
          if (
            notification.android._notification._data.msg !== CHAT_ROOM_IN &&
            notification.android._notification._data.msg !== ROOM_OUT
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                ' : ' +
                notification.android._notification._data.msg,
            );
          } else if (
            notification.android._notification._data.msg === ROOM_OUT
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                '님이 채팅방을 나갔습니다.',
            );
          }
        },
      );
    } else {
      this.removeToastListener = () => {};
    }
    // 최소화에서 들어옴
    this.removeNotificationOpenedListener = Firebase.notifications().onNotificationOpened(
      notificationOpen => {
        const notification = notificationOpen.notification.data;
        console.log('onNotificationOpened : ' + JSON.stringify(notification));
        this.state.navigation.navigate({
          routeName: 'BattleTalk',
          params: {
            roomKey: notification.roomKey,
            id: notification.id,
            profile: notification.profile,
            name: notification.name,
          },
        });
      },
    );
    this.init();
  }

  init = async () => {
    this.getData();
    let {chatRoomList} = this.state;
    try {
      // get ChatRoomList
      let list = [];
      var userRef = firebase.database().ref('chatRoomList/');
      // .orderByChild('key');
      userRef.on('value', dataSnapshot => {
        chatRoomList = [];
        dataSnapshot.forEach(child => {
          chatRoomList.push({
            key: child.key,
            makeUser: child.val().makeUser,
            joinUser: child.val().joinUser,
            chatList: child.val().chatList,
            date: child.val().date,
            sports: child.val().sports,
            area: child.val().area,
            battleStyle: child.val().battleStyle,
            battleDate: child.val().battleDate,
            level: child.val().level,
            memo: child.val().memo,
            battleState: child.val().battleState,
            battleResult: child.val().battleResult,
            deleteHistory: child.val().deleteHistory,
            deleteChat: child.val().deleteChat,
            deleteBattle: child.val().deleteBattle,
            endUser: child.val().endUser,
            openBox: child.val().openBox,
            requestUser: child.val().requestUser,
          });
          chatRoomList.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          });
          // chatRoomList.reverse();
        });
        this.setState({
          chatRoomList: chatRoomList,
          loading: false,
        });
      });
    } catch (error) {
      error = "Cnat't get ChatRoomList";
      alert(error);
    }
  };

  loadingCheck = check => {
    this.setState(check);
    console.log('\n\n\n\n' + this.state.loading);
  };

  deleteMyBattle = async (roomKey, myId, id) => {
    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/deleteHistory')
      .update({
        [myId]: myId,
      });
    let deleteHistory = [];
    let deleteChat = [];
    var checkDeleteHistory = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/deleteHistory');
    checkDeleteHistory.once('value', dataSnapshot => {
      deleteHistory = dataSnapshot.val();
      console.log(deleteHistory[myId]);
      this.refs.toast.show('배틀내역을 삭제했습니다.');
    });
    var checkDeleteChat = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/deleteChat');
    checkDeleteChat.once('value', dataSnapshot => {
      deleteChat = dataSnapshot.val();
    });

    // 채팅방 + 배틀내역 전부삭제 확인
    if (
      deleteHistory[myId] === myId &&
      deleteHistory[id] === id &&
      deleteChat[myId] === myId &&
      deleteChat[id] === id
    ) {
      console.log('DELETE CHATROOM');
      firebase
        .database()
        .ref('chatRoomList/' + roomKey)
        .remove();
    }
  };

  sendToServer = async (
    senderId,
    senderName,
    senderProfile,
    msg,
    token,
    roomKey,
  ) => {
    const firebase_server_key =
      'AAAABOeF95E:APA91bGCKfJwCOUeYC8QypsS7yCAtR8ZOZf_rAj1iRK_OvIB3mYXYnva4DAY28XmUZA1GpXsdp1eRf9rPeuIedr7eX_7yFWbL-C_4JfVGSFGorCdzjOA0AyYPxB83M8TTAfUj62tUZhH';
    console.log('sendToFcm');

    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'key=' + firebase_server_key,
      },
      body: JSON.stringify({
        registration_ids: [token],
        notification: {
          title: senderName,
          body: msg,
        },
        data: {
          roomKey: roomKey,
          id: senderId,
          name: senderName,
          profile: senderProfile,
          msg: msg,
        },
      }),
    })
      .then(response => {
        console.log('FCM msg sent!');
        // console.log(response);
        // console.log('FCM Token: ' + token);
        console.log('Message: ' + msg);
      })
      .catch(error => {
        alert(error);
      });
  };

  componentWillUnmount() {
    console.log('componentWillUnmount[MyBattleContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    firebase
      .database()
      .ref('chatRoomList/')
      .off();
  }

  render() {
    const {loading, chatRoomList, myId} = this.state;
    return (
      <>
        <MyBattlePresenter
          loading={loading}
          chatRoomList={chatRoomList}
          myId={myId}
          deleteMyBattle={this.deleteMyBattle}
          loadingCheck={this.loadingCheck}
        />
        <Toast
          ref="toast"
          style={{backgroundColor: '#fee6d0'}}
          position="top"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{color: '#000000'}}
        />
      </>
    );
  }
}
