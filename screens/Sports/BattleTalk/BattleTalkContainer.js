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

  handleScroll = event => {
    // console.log('handleScroll 1 : ' + event.nativeEvent.contentOffset.y);
    console.log('handleScroll 1 : ' + event);
  };

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
  insertChatList = async msg => {
    await console.log('insertChatList: ' + msg);
    if (msg !== null && msg !== '') {
      let reader = {};
      reader[this.state.myName] = this.state.myName;
      try {
        await this.writeChattingAdd(
          this.state.id,
          this.state.myName,
          this.state.msg,
          moment()
            .local()
            .format('LT'),
          reader,
        );
        this.setState({
          msg: '',
        });
      } catch (error) {
        console.log('insert Chatting message error ::: ' + error);
      }
    } else {
      console.log('message : null');
    }
  };

  // 체팅방 들어와있는지 상태 체크
  updateSingleData(room, chatList) {
    const {myName} = this.state;
    let i;
    if (typeof chatList.length !== 'undefined' && chatList.length > 0) {
      let list = {};
      chatList.forEach(child => {
        let key = child.key;
        let reader = child.read;
        reader[myName] = myName;
        list[key] = {
          user: child.user,
          msg: child.msg,
          date: child.date,
          read: reader,
        };
      });
      // console.log('check2 :::: ' + JSON.stringify(list));
      firebase
        .database()
        .ref('chatRoomList/' + room)
        .update({
          chatList: list,
        });
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
            JSON.stringify(dataSnapshot),
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

  // Screen OUT
  componentWillUnmount() {
    console.log('componentWillUnmount ::: ');
    firebase
      .database()
      .ref('chatRoomList/' + this.state.id + '/chatList/')
      .off('value');
  }

  render() {
    const {
      loading,
      getChatList,
      msg,
      profile,
      name,
      myProfile,
      myName,
    } = this.state;
    return (
      <BattleTalkPresenter
        loading={loading}
        handleScroll={this.handleScroll}
        getChatList={getChatList}
        insertChatList={this.insertChatList}
        msgHandler={this.msgHandler}
        msg={msg}
        // 상대 정보
        profile={profile}
        name={name}
        // 내 정보
        myName={myName}
        myProfile={myProfile}
      />
    );
  }
}
