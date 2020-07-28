import React from 'react';
import {Platform, Alert} from 'react-native';
import SportsPresenter from './SportsPresenter';
import {tv, movie} from '../../api/Api';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';
import Firebase from 'react-native-firebase';
import {CHAT_ROOM_IN, ROOM_OUT} from '../../constants/Strings';

var M_ID, M_NAME, M_PROFILE;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      listName: null,
      listChanged: null,
      chatRoomList: [],
      myId: null,
      myName: null,
      myProfile: null,
      navigation,
      toast: null,
      roomOutCheck: false,
      roomKey: null,
      error: null,
    };
    console.log('constructor ----');
    var self = this;
    self.init();
  }

  init = () => {
    this.getData();
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyA1YDEatBC9m11UqOGyrzV6AJXwJDff1fI',
        authDomain: 'lespo-261906.firebaseapp.com',
        databaseURL: 'https://lespo-261906.firebaseio.com',
        projectId: 'lespo-261906',
        storageBucket: 'lespo-261906.appspot.com',
        messagingSenderId: '21064185745',
        appId: '1:21064185745:web:71e6c40dc7f8f3bce00c30',
        measurementId: 'G-YSN50WBZB9',
      });
    }
  };

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

    try {
      this.getData();
      // get ChatRoomList
      this.getChatRoomList();
    } catch (error) {
      console.log(error);
      error = "Cnat't get sportsBattle list";
    }
    // 화면 돌아왔을 때 reload !
    // this.subs = [
    //   this.props.navigation.addListener('willFocus', () => {
    //     console.log('willFocus ::: reload');
    //     // this.onListChanging();
    //     this.setState({
    //       chatRoomList: [],
    //     });
    //   }),
    // ];
  }

  // get chatRoomList
  getChatRoomList = async listName => {
    console.log('getChatRoomList');
    let {chatRoomList, listChanged} = this.state;
    try {
      var userRef = firebase.database().ref('chatRoomList/');
      // .orderByChild('key');
      userRef.on('value', dataSnapshot => {
        chatRoomList = [];
        listChanged = [];
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
          chatRoomList.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          });
          listChanged = chatRoomList
            .filter(function(list) {
              if (listName === 'all') {
                return list.key;
              } else if (listName === 'billiards') {
                return list.sports === '당구' || list.sports === '상관없음';
              } else if (listName === 'basketball') {
                return list.sports === '농구' || list.sports === '상관없음';
              } else if (listName === 'football') {
                return list.sports === '축구' || list.sports === '상관없음';
              } else if (listName === 'baseball') {
                return list.sports === '야구' || list.sports === '상관없음';
              } else if (listName === 'bowling') {
                return list.sports === '볼링' || list.sports === '상관없음';
              } else if (listName === 'golf') {
                return list.sports === '골프' || list.sports === '상관없음';
              } else if (listName === 'badminton') {
                return list.sports === '배드민턴' || list.sports === '상관없음';
              } else {
                return list.key;
              }
            })
            .map(function(list) {
              return list;
            });
          listChanged = listChanged
            .filter(function(list) {
              return (
                list.makeUser.userId !== M_ID &&
                list.chatList === '' &&
                list.joinUser.userId === ''
              );
            })
            .map(function(list) {
              return list;
            });
        });
        if (listChanged.length === 0) {
          // if (listName !== undefined) {
          //   this.setState({
          //     chatRoomList: [],
          //   });
          //   this.state.chatRoomList = [];
          // }
          this.setState({
            chatRoomList: [],
            loading: false,
          });
          this.state.chatRoomList = [];
          this.refs.toast.show('등록배틀리스트가 없습니다.');
        } else {
          this.setState({
            chatRoomList: listChanged,
            loading: false,
          });
        }
      });
    } catch (error) {}
  };

  // 나갔을때
  componentWillUnmount() {
    console.log('componentWillUnmount[SportsContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    firebase
      .database()
      .ref('chatRoomList/')
      .off('value');
    // this.subs.forEach(sub => sub.remove());
  }

  // List 입력값 받아온다
  handleListUpdate = list => {
    this.setState({
      listName: list,
    });
    console.log('getListName ::: ' + list);
    if (Platform.OS === 'android') {
      console.log('go Android ::: ' + list);
      this.state.listName = list;
      this.onListChanging();
    }
  };

  // 검색한 결과값
  onListChanging = async () => {
    let {listName} = this.state;
    if (listName !== '') {
      this.setState({
        loading: true,
      });
      try {
        this.getChatRoomList(listName);
      } catch {
        error = "Can't Search";
      }
      return;
    }
  };

  outCheck = check => {
    this.setState(check);
    if (this.state.roomOutCheck) {
      Alert.alert('상대방이 배틀을 취소했습니다.');
      this.setState({loading: true});
      setTimeout(() => {
        firebase
          .database()
          .ref('chatRoomList/' + this.state.roomKey)
          .remove()
          .then(data => {
            //success callback
            console.log('chatRoom Out: ', data);
            this.setState({loading: false});
          })
          .catch(error => {
            //error callback
            console.log('error ', error);
          });
      }, 2000);
    }
  };

  render() {
    const {loading, listName, listChanged, myId, chatRoomList} = this.state;
    return (
      <>
        <SportsPresenter
          myId={myId}
          loading={loading}
          listName={listName}
          // listChanged={listChanged}
          chatRoomList={chatRoomList}
          onListChanging={this.onListChanging}
          handleListUpdate={this.handleListUpdate}
          toast={this.refs.toast}
          outCheck={this.outCheck}
        />
        <Toast
          ref={'toast'}
          style={{backgroundColor: '#fee6d0'}}
          position="bottom"
          positionValue={100}
          fadeInDuration={550}
          fadeOutDuration={2000}
          opacity={1}
          textStyle={{color: '#000000'}}
        />
      </>
    );
  }
}
