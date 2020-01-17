import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import BattleTalkPresenter from './BattleTalkPresenter';
import {Alert} from 'react-native';

var M_ID = '';
var M_NAME = '';
var M_PROFILE = '';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: {roomKey, id, profile, name},
        },
      },
    } = props;
    this.state = {
      roomKey,
      id,
      profile,
      name,
      myId: '',
      myName: '',
      myProfile: '',
      myRating: 5,
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
    console.log('insertChatList: ' + msg);
    if (msg !== null && msg !== '') {
      let reader = {};
      reader[this.state.myId] = this.state.myId;
      try {
        await this.writeChattingAdd(
          this.state.roomKey,
          this.state.myId,
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
    const {myId} = this.state;
    let i;
    if (typeof chatList.length !== 'undefined' && chatList.length > 0) {
      let list = {};
      chatList.forEach(child => {
        let key = child.key;
        let reader = child.read;
        reader[myId] = myId;
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
      M_ID = await AsyncStorage.getItem('@USER_ID');
      M_NAME = await AsyncStorage.getItem('@USER_NAME');
      M_PROFILE = await AsyncStorage.getItem('@USER_PROFILE');
      if (M_PROFILE !== null || M_PROFILE !== '') {
        this.setState({
          myId: M_ID,
          myName: M_NAME,
          myProfile: M_PROFILE,
        });
        if (this.state.myProfile === null) {
          this.setState({myProfile: ''});
        }
        console.log('myName : ' + this.state.myName);
        console.log('myProfile : ' + this.state.myProfile);
        this.updateSingleData(id, getChatList);
        let joinUser = {
          userId: this.state.myId,
          userName: this.state.myName,
          userProfile: this.state.myProfile,
          userRating: this.state.myRating,
        };
        firebase
          .database()
          .ref('chatRoomList/' + this.state.roomKey)
          .update({
            joinUser,
          })
          .then(data => {
            //success callback
            console.log('joinUser Add: ', data);
          })
          .catch(error => {
            //error callback
            console.log('error ', error);
          });
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
    let {roomKey, getChatList} = this.state;
    try {
      // get ChattingList
      var userRef = firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/chatList/');
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
        this.getData(roomKey, getChatList);
        //
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
    let checkSendMsg = [];
    checkSendMsg = this.state.getChatList.filter(
      list => list.user === this.state.myId,
    );
    console.log('check send msg ? :: ' + checkSendMsg.length);
    if (checkSendMsg.length === 0) {
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
          joinUser,
        })
        .then(data => {
          //success callback
          console.log('outUser Add: ', data);
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
    }

    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/chatList/')
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
      myId,
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
        myId={myId}
        myName={myName}
        myProfile={myProfile}
      />
    );
  }
}
