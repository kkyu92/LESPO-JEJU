import React from 'react';
import {Platform} from 'react-native';
import BattleTalkPresenter from './BattleTalkPresenter';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';

var M_ID, M_NAME, M_PROFILE;

export default class extends React.Component {
  state = {
    loading: true,
    chatRoomList: [],
    myId: '',
    myName: '',
    myProfile: '',
    error: null,
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
        console.log(M_ID);
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
    try {
      this.getData();
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
          });
          chatRoomList = chatRoomList.filter(
            list => list.joinUser.userId !== '',
          );
          chatRoomList.sort(function(a, b) {
            return new Date(b.lastRealTime) - new Date(a.lastRealTime);
          });
          // chatRoomList.reverse();
          this.setState({
            chatRoomList: chatRoomList,
            loading: false,
          });
          // console.log(
          //   'chatList : ' + JSON.stringify(this.state.chatRoomList),
          // );
        });
      });
    } catch (error) {
      console.log(error);
      error = "Cnat't get ChatRoomList";
    }
  }

  componentWillUnmount() {
    firebase
      .database()
      .ref('chatRoomList/')
      .off();
  }

  render() {
    const {loading, chatRoomList, myId} = this.state;
    return (
      <BattleTalkPresenter
        loading={loading}
        chatRoomList={chatRoomList}
        myId={myId}
      />
    );
  }
}
