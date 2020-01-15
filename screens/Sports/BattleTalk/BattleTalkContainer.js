import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import BattleTalkPresenter from './BattleTalkPresenter';
import {Alert} from 'react-native';

var M_NAME = '';
var M_PROFILE = '';

export default class extends React.Component {
  constructor(props) {
    super(props);
    // this.init();
    const {
      navigation: {
        state: {
          params: {id, profile, name},
        },
      },
    } = props;
    this.state = {
      id,
      profile,
      name,
      myName: '',
      myProfile: '',
      loading: true,
      getChatList: [],
      insertChatList: null,
      msg: null,
      error: null,
    };
  }

  // msg handler
  msgHandler = selected => {
    console.log('setMessage change fun ::: ' + selected);
    this.setState({
      msg: selected,
    });
  };

  // write Data [ set / push = uuid ]
  writeChattingAdd(key, user, msg, date, read) {
    firebase
      .database()
      .ref('chatRoomList/' + key + '/chatList/')
      .push({user, msg, date, read})
      .then(data => {
        //success callback
        console.log('writeChatting Add: ', data);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  }

  // chatting add
  insertChatList = async () => {
    if (this.state.msg !== null) {
      // let reader = [];
      // reader.push({
      //   is_read: false,
      //   key: this.state.myName,
      //   value: this.state.myName,
      // });
      let reader = {};
      reader[this.state.myName] = this.state.myName;
      try {
        this.writeChattingAdd(
          this.state.id,
          this.state.myName,
          this.state.msg,
          moment()
            .local()
            .format('LT'),
          reader,
        );
      } catch (error) {
        console.log('insert Chatting message error ::: ' + error);
      } finally {
        console.log(
          this.state.myName,
          this.state.msg,
          moment()
            .local()
            .format('LT'),
          reader,
        );
      }
    } else {
      console.log('message : null');
    }
  };

  // updateReader(key) {
  //   var readUser = firebase.database().ref('chatRoomList/' + key + '/chatList/')
  //   // Modify the 'first' and 'last' properties, but leave other data at
  //   // adaNameRef unchanged.
  //   readUser.update({ first: 'Ada', last: 'Lovelace' });
  // }

  // 체팅방 들어와있는지 상태 체크
  updateSingleData(room, chatList) {
    const {myName} = this.state;
    // console.log(
    //   room + ' :::: ' + chatList.length + JSON.stringify(chatList[0].read),
    // );
    let i;
    if (typeof chatList.length !== 'undefined' && chatList.length > 0) {
      for (i = 0; i < chatList.length; i++) {
        let reader = chatList[i].read;
        reader[myName] = myName;
        firebase
          .database()
          .ref('chatRoomList/' + room + '/chatList/' + chatList[i].key + '/')
          .update({
            // key: chatList[i].key,
            date: chatList[i].date,
            user: chatList[i].user,
            read: reader,
            msg: chatList[i].msg,
          });
      }
    }
  }

  getData = async (id, getChatList) => {
    console.log('getData');
    try {
      M_NAME = await AsyncStorage.getItem('@USER_NAME');
      M_PROFILE = await AsyncStorage.getItem('@USER_PROFILE');
      if (M_PROFILE !== null || M_PROFILE !== '') {
        this.setState({
          myName: M_NAME,
          myProfile: M_PROFILE,
        });
        console.log('myName : ' + this.state.myName);
        console.log('myProfile : ' + this.state.myProfile);
        this.updateSingleData(id, getChatList);
      } else {
        console.log('Login profile image null');
      }
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

  // init 초기값
  async componentDidMount() {
    let {id, getChatList} = this.state;
    try {
      // get ChattingList
      var userRef = firebase
        .database()
        .ref('chatRoomList/' + id + '/chatList/');
      // .orderByChild('key');
      userRef.on('value', dataSnapshot => {
        getChatList = [];
        dataSnapshot.forEach(child => {
          getChatList.push({
            key: child.key,
            user: child.val().user,
            msg: child.val().msg,
            date: child.val().date,
            read: child.val().read,
          });
          this.setState({
            getChatList: getChatList,
            loading: false,
          });
        });
        console.log(
          'Firebase get chattingList Finish----------     ' +
            JSON.stringify(getChatList),
        );
        // 내 로그인 정보 불러오ß기
        this.getData(id, getChatList);
      });
      // this.updateSingleData(id, getChatList);
      console.log(
        'chatList Data[try 1]: ' + JSON.stringify(this.state.getChatList),
      );
    } catch (error) {
      console.log('get chattingList error ::: ' + error);
    } finally {
      if (typeof getChatList !== 'undefined' && getChatList instanceof Array) {
        this.setState({
          loading: false,
        });
      }
      console.log('try/catch [ finally ]');
    }
  }

  render() {
    const {loading, getChatList, profile, name, myProfile} = this.state;
    return (
      <BattleTalkPresenter
        loading={loading}
        getChatList={getChatList}
        insertChatList={this.insertChatList}
        msgHandler={this.msgHandler}
        // 상대 정보
        profile={profile}
        name={name}
        // 내 정보
        myProfile={myProfile}
      />
    );
  }
}
