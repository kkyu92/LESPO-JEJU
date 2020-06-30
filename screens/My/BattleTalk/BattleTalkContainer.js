import React from 'react';
import {Platform, Alert} from 'react-native';
import BattleTalkPresenter from './BattleTalkPresenter';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';
import Firebase from 'react-native-firebase';
import {CHAT_ROOM_IN, ROOM_OUT} from '../../../constants/Strings';
import moment from 'moment';
import {FirebasePush} from '../../../api/PushNoti';

var M_ID, M_NAME, M_PROFILE;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      chatRoomList: [],
      id: '',
      myId: '',
      myName: '',
      myProfile: '',
      roomOutCheck: false,
      roomKey: null,
      error: null,
      navigation,
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
        console.log(M_ID);
        // get ChatRoomList
        let list = [];
        var userRef = firebase.database().ref('chatRoomList/');
        // .orderByChild('key');
        userRef.on('value', dataSnapshot => {
          let chatRoomList = [];
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
              lastRealTime: child.val().lastRealTime,
              lastMsg: child.val().lastMsg,
              deleteChat: child.val().deleteChat,
              deleteHistory: child.val().deleteHistory,
              deleteBattle: child.val().deleteBattle,
              unReadCount: child.val().unReadCount,
            });
            // console.log('MID ::: ' + M_ID);
            // console.log('makeUserId ::: ' + child.val().makeUser.userId);
            // console.log('joinUserId ::: ' + child.val().joinUser.userId);
            // let id = '';
            // if (child.val().makeUser.userId === M_ID) {
            //   id = child.val().joinUser.userId;
            // } else if (child.val().joinUser.userId === M_ID) {
            //   id = child.val().makeUser.userId;
            // }
            // console.log('deleteUSer ::: ' + id);
            // if (
            //   child.val().deleteBattle[id] === id &&
            //   id !== '' &&
            //   !this.state.roomOutCheck
            // ) {
            //   Alert.alert('상대방이 배틀을 취소하였습니다.111');
            //   this.setState({
            //     id: id,
            //     loading: true,
            //   });
            //   setTimeout(() => {
            //     firebase
            //       .database()
            //       .ref('chatRoomList/' + child.key)
            //       .remove()
            //       .then(data => {
            //         //success callback
            //         console.log('chatRoom Out: ', data);
            //       })
            //       .catch(error => {
            //         //error callback
            //         console.log('error ', error);
            //       });
            //     this.setState({loading: false});
            //   }, 1000);
            // }
            chatRoomList = chatRoomList.filter(
              list => list.joinUser.userId !== '',
            );
            chatRoomList.sort(function(a, b) {
              return new Date(b.lastRealTime) - new Date(a.lastRealTime);
            });
          });
          this.setState({
            chatRoomList: chatRoomList,
            loading: false,
          });
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
          } else {
            this.getData();
          }
        },
      );
    } else {
      try {
        Firebase.messaging().requestPermission();
      } catch (error) {
        alert('user reject permission');
      }
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
    let roomKey = await AsyncStorage.getItem('@NOTI_ROOMKEY');
    let id = await AsyncStorage.getItem('@NOTI_ID');
    let name = await AsyncStorage.getItem('@NOTI_NAME');
    let profile = await AsyncStorage.getItem('@NOTI_PROFILE');
    if (roomKey !== '' && roomKey !== null) {
      this.state.navigation.navigate({
        routeName: 'BattleTalk',
        params: {
          roomKey,
          id,
          profile,
          name,
        },
      });
      // this.setState({
      //   loading: false,
      // });
    }
    this.getData();
  }

  deleteChat = async (roomKey, myId, id) => {
    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/deleteChat')
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
    });
    var checkDeleteChat = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/deleteChat');
    checkDeleteChat.once('value', dataSnapshot => {
      deleteChat = dataSnapshot.val();
      console.log(deleteChat[myId]);
      this.refs.toast.show('배틀톡을 삭제했습니다.');
    });
    // 채팅방 + 배틀내역 전부삭제 확인
    if (deleteChat[myId] === myId && deleteChat[id] === id) {
      if (deleteHistory[myId] === myId && deleteHistory[id] === id) {
        console.log('DELETE CHATROOM');
        firebase
          .database()
          .ref('chatRoomList/' + roomKey)
          .remove();
      }
    } else {
      firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/chatList/')
        .push({user: myId, msg: ROOM_OUT, date: '', read: '', place: false})
        .then(data => {
          //success callback
          console.log('writeChatting Add: ', data);
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
      firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/')
        .update({
          lastTime: moment()
            .local()
            .format('LT'),
          lastRealTime: moment()
            .local()
            .format(),
          lastMsg: '상대방이 채팅방을 나갔습니다.',
        })
        .then(data => {
          //success callback
          console.log('writeChatting Add: ', data);
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
      // fcm
      let otherToken;
      firebase
        .database()
        .ref('FcmTokenList/' + id)
        .once('value', dataSnapshot => {
          otherToken = dataSnapshot;
          FirebasePush.sendToServerRoomOut(
            roomKey,
            id,
            this.state.myId,
            this.state.myName,
            '',
            ROOM_OUT,
            '',
            otherToken,
          );
        });
    }
  };

  outCheck = check => {
    this.setState(check);
    if (this.state.roomOutCheck) {
      this.setState({loading: true});
      Alert.alert('상대방이 배틀을 취소했습니다.');
      setTimeout(() => {
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
        this.setState({loading: false});
      }, 2000);

      // this.props.navigation.goBack();
    }
  };

  componentWillUnmount() {
    console.log('componentWillUnmount[MY BattleTalkContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    firebase
      .database()
      .ref('chatRoomList/')
      .off();
    if (this.state.roomOutCheck) {
      // firebase
      //   .database()
      //   .ref('chatRoomList/' + this.state.roomKey)
      //   .remove()
      //   .then(data => {
      //     //success callback
      //     console.log('chatRoom Out: ', data);
      //   })
      //   .catch(error => {
      //     //error callback
      //     console.log('error ', error);
      //   });
    }
  }

  render() {
    const {loading, chatRoomList, myId, id} = this.state;
    return (
      <>
        <BattleTalkPresenter
          loading={loading}
          chatRoomList={chatRoomList}
          myId={myId}
          id={id}
          deleteChat={this.deleteChat}
          outCheck={this.outCheck}
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
