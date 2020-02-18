import React from 'react';
import {Platform} from 'react-native';
import MyBattlePresenter from './MyBattlePresenter';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';
import Firebase from 'react-native-firebase';

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
          this.refs.toast.show(
            notification.android._notification._data.name +
              ' : ' +
              notification.android._notification._data.msg,
          );
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
    let {chatRoomList} = this.state;
    try {
      this.getData();
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
          });
          chatRoomList.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          });
          // chatRoomList.reverse();
          this.setState({
            chatRoomList: chatRoomList,
          });
        });
      });
    } catch (error) {
      console.log(error);
      error = "Cnat't get ChatRoomList";
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

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
