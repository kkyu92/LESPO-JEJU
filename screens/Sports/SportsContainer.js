import React from 'react';
import {Platform} from 'react-native';
import SportsPresenter from './SportsPresenter';
import {tv, movie} from '../../api/Api';
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
      listName: null,
      listChanged: null,
      chatRoomList: [],
      myId: null,
      myName: null,
      myProfile: null,
      navigation,
      toast: null,
      error: null,
    };
    console.log('constructor ----');
    var self = this;
    self.init();
  }

  init = () => {
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
          this.toast.show(
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
    let {listChanged, chatRoomList, error} = this.state;
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
            loading: false,
          });
        });
        this.setState({
          loading: false,
        });
      });
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
    const {listName} = this.state;
    if (listName !== '') {
      console.log('listChanging ::: ' + listName);
      let listChanged, error;
      this.setState({
        loading: true,
      });
      try {
        if (listName === 'latest') {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('latest'));
        } else if (listName === 'battle') {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('battle'));
        } else if (listName === 'nearest') {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('nearest'));
        } else {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('default'));
        }
      } catch {
        error = "Can't Search";
      } finally {
        this.setState({
          loading: false,
          listChanged,
          listName,
          error,
        });
      }
      return;
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
          // onListChanging={this.onListChanging}
          // handleListUpdate={this.handleListUpdate}
        />
        <Toast
          ref={toast => {
            this.toast = toast;
          }}
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
