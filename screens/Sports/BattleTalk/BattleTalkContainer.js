import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import BattleTalkPresenter from './BattleTalkPresenter';
import {Modal, Alert, AppState, Platform} from 'react-native';
import SimpleDialog from '../../../components/SimpleDialog';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {LESPO_API} from '../../../api/Api';
import {CHAT_ROOM_IN, RESPONSE_OK, ROOM_OUT} from '../../../constants/Strings';
import {FirebasePush} from '../../../api/PushNoti';

var M_ID = '';
var M_NAME = '';
var M_PROFILE = '';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: {roomKey, id, profile, name, container},
        },
      },
    } = props;
    this.state = {
      deleteChat: {},
      appState: AppState.currentState,
      notiCheck: false,
      roomKey,
      id,
      profile,
      name,
      container,
      otherToken: '',
      otherCoin: 0,
      coin: 0,
      myId: null,
      myName: '',
      myProfile: '',
      myRating: 5,
      loading: true,
      getChatList: [],
      insertChatList: null,
      msg: null,
      battlePlace: '',
      makeUser: '',
      joinUser: '',
      isModalVisible: false,
      battleState: '',
      requestUser: '',
      unMount: false,
      unReadCount: 0,
      deleteUser: {},
      deleteRoomCheck: false,
      battlePlace: 0,
      error: null,
    };
    console.log('@@@@@@@: battleTalk' + this.state.makeUser);
  }

  updateState = async (myId, what) => {
    let {getChatList} = this.state;
    // check user in room
    let makerIn;
    let joinerIn;
    let user = this.state.myId;
    let msg;
    let battleState;
    if (what === 'request') {
      msg = '배틀을 신청합니다.';
      battleState = '배틀요청';
    } else if (what === 'OK') {
      msg = '배틀을 수락합니다.';
      battleState = '배틀진행중';
    }
    let date = moment()
      .local()
      .format('LT');
    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
    console.log('\n1\n');
    var checkJoiner = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/joinUser/userIn');
    checkJoiner.once('value', dataSnapshot => {
      joinerIn = JSON.stringify(dataSnapshot);
    });
    if ((makerIn === 'true') & (joinerIn === 'true')) {
      let reader = {};
      reader[this.state.id] = this.state.id;
      reader[this.state.myId] = this.state.myId;

      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/chatList')
        .push({user, msg, date, read: reader, place: false})
        .then(data => {
          //success callback
          console.log('battle start notice Add: ', data);
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
      // 안읽은 메시지 카운트 표시
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/unReadCount')
        .update({
          [this.state.id]: 0,
          [this.state.myId]: 0,
        });
      getChatList.push({
        key: '',
        user: user,
        msg: msg,
        date: date,
        read: reader,
        place: false,
      });
      this.setState({
        getChatList,
      });
    } else {
      let reader = {};
      reader[this.state.myId] = this.state.myId;

      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/chatList')
        .push({user, msg, date, read: reader, place: false})
        .then(data => {
          //success callback
          console.log('battle start notice Add: ', data);
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
      let count = this.state.unReadCount;
      count++;
      this.setState({
        unReadCount: count,
      });
      // 안읽은 메시지 카운트 표시
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/unReadCount')
        .update({
          [this.state.id]: count,
        });
      getChatList.push({
        key: '',
        user: user,
        msg: msg,
        date: date,
        read: reader,
        place: false,
      });
      this.setState({
        getChatList,
      });
    }

    if (what !== 'update') {
      // fcm
      let otherToken;
      firebase
        .database()
        .ref('FcmTokenList/' + this.state.id)
        .once('value', dataSnapshot => {
          otherToken = dataSnapshot;
          FirebasePush.sendToServerBattleTalk(
            this.state.roomKey,
            this.state.id,
            this.state.myId,
            this.state.myName,
            this.state.myProfile,
            msg,
            date,
            otherToken,
          );
        });
    }

    let endUser = {
      user1: '',
      user2: '',
    };
    // endUser[this.state.id] = this.state.id;
    // endUser[this.state.myId] = this.state.myId;
    if (what === 'request') {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey)
        .update({
          lastTime: moment()
            .local()
            .format('LT'),
          lastRealTime: moment()
            .local()
            .format(),
          lastMsg: msg,
          battleState: battleState,
          endUser,
          requestUser: myId,
        });
    } else if (what === 'OK') {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey)
        .update({
          lastTime: moment()
            .local()
            .format('LT'),
          lastRealTime: moment()
            .local()
            .format(),
          lastMsg: msg,
          battleState: battleState,
          endUser,
        });
      this.coinCheckDelete();
    }
  };

  coinCheckDelete = async () => {
    // 코인차감
    let API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: API_TOKEN,
      },
    };
    let params = {a: 0};
    this.deleteCoin(params, config);

    let otherToken;
    firebase
      .database()
      .ref('APITokenList/' + this.state.id)
      .once('value', dataSnapshot => {
        otherToken = JSON.stringify(dataSnapshot);
        otherToken = otherToken.replace('"', '');
        otherToken = otherToken.replace('"', '');
        console.log(otherToken.length);
        const coinConfig = {
          headers: {
            Authorization: otherToken,
          },
        };
        this.deleteCoin(params, coinConfig);
      });
  };

  deleteCoin = async (params, coinConfig) => {
    await LESPO_API.deleteCoin(params, coinConfig)
      .then(response => {
        console.log('delete other coin');
      })
      .catch(error => {
        console.log('getCoin fail: ' + error);
      });
  };

  // msg handler
  msgHandler = async selected => {
    this.setState({
      msg: selected,
    });
  };

  // write Data [ set / push = uuid ]
  writeChattingAdd = async (key, user, msg, date, read, place = false) => {
    let {getChatList} = this.state;
    getChatList.push({
      key: '',
      user: user,
      msg: msg,
      date: date,
      read: read,
      place,
    });
    firebase
      .database()
      .ref('chatRoomList/' + key + '/chatList/')
      .push({user, msg, date, read, place})
      .then(data => {
        //success callback
        console.log('writeChatting Add Success: ', msg);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
    firebase
      .database()
      .ref('chatRoomList/' + key + '/')
      .update({
        lastTime: date,
        lastRealTime: moment()
          .local()
          .format(),
        lastMsg: msg,
      })
      .then(data => {
        //success callback
        console.log('writeChatting Add Success: ', msg);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
    // fcm
    let otherToken;
    firebase
      .database()
      .ref('FcmTokenList/' + this.state.id)
      .once('value', dataSnapshot => {
        otherToken = dataSnapshot;
        FirebasePush.sendToServerBattleTalk(
          this.state.roomKey,
          this.state.id,
          this.state.myId,
          this.state.myName,
          this.state.myProfile,
          msg,
          date,
          otherToken,
        );
      });
    this.setState({
      msg: '',
      getChatList,
    });
  };

  // chatting add
  insertChatList = async msg => {
    console.log('insertChatList: ' + msg);
    // check user in room
    let makerIn;
    let joinerIn;
    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
    console.log('\n2\n');
    var checkJoiner = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/joinUser/userIn');
    checkJoiner.once('value', dataSnapshot => {
      joinerIn = JSON.stringify(dataSnapshot);
    });
    if (msg !== null && msg !== '') {
      if ((makerIn === 'true') & (joinerIn === 'true')) {
        let reader = {};
        reader[this.state.myId] = this.state.myId;
        reader[this.state.id] = this.state.id;
        try {
          this.writeChattingAdd(
            this.state.roomKey,
            this.state.myId,
            this.state.msg,
            moment()
              .local()
              .format('LT'),
            reader,
          );
        } catch (error) {
          console.log('insert Chatting message error ::: ' + error);
        }
      } else {
        let count = this.state.unReadCount;
        count++;
        this.setState({
          unReadCount: count,
        });
        let reader = {};
        reader[this.state.myId] = this.state.myId;
        try {
          this.writeChattingAdd(
            this.state.roomKey,
            this.state.myId,
            this.state.msg,
            moment()
              .local()
              .format('LT'),
            reader,
          );
          // 안읽은 메시지 카운트 표시
          firebase
            .database()
            .ref('chatRoomList/' + this.state.roomKey + '/unReadCount')
            .update({
              [this.state.id]: count,
            });
        } catch (error) {
          console.log('insert Chatting message error ::: ' + error);
        }
      }
    } else {
      console.log('message : null');
    }
  };

  // 체팅방 들어와있는지 상태 체크 [읽음표시]
  updateSingleData = async (room, chatList) => {
    let MID = await AsyncStorage.getItem('@USER_ID');
    let i;
    if (typeof chatList.length !== 'undefined' && chatList.length > 0) {
      let list = {};
      chatList.forEach(child => {
        let key = child.key;
        let reader = child.read;
        reader[MID] = MID;
        list[key] = {
          user: child.user,
          msg: child.msg,
          date: child.date,
          read: reader,
          place: child.place,
        };
      });
      console.log('check :::: chatList UPDATE');
      firebase
        .database()
        .ref('chatRoomList/' + room)
        .update({
          chatList: list,
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
        if (this.state.myProfile === null) {
          this.setState({myProfile: ''});
        }
        // get makeUser
        let makeUser;
        var maker = firebase
          .database()
          .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userId');
        maker.once('value', dataSnapshot => {
          makeUser = JSON.stringify(dataSnapshot);
          if (makeUser !== JSON.stringify(this.state.myId)) {
            let joinUser = {
              userIn: true,
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
                this.settingFinish();
              })
              .catch(error => {
                //error callback
                console.log('joinUser error ', error);
              });
          } else {
            firebase
              .database()
              .ref('chatRoomList/' + this.state.roomKey + '/makeUser')
              .update({
                userIn: true,
              })
              .then(data => {
                //success callback
                console.log('makeUser Add: ', data);
                this.settingFinish();
              })
              .catch(error => {
                //error callback
                console.log('makeUser error ', error);
              });
          }
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
    AppState.addEventListener('change', this._handleAppStateChange);
    let MID = await AsyncStorage.getItem('@USER_ID');
    let MNAME = await AsyncStorage.getItem('@USER_NAME');
    let {getChatList, roomKey} = this.state;

    let id = await AsyncStorage.getItem('@NOTI_ID');
    if (id) {
      this.setState({notiCheck: true});
      this.resetNotiData();
    }

    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      this.removeToastListener = Firebase.notifications().onNotification(
        notification => {
          let reader = {};
          reader[this.state.id] = this.state.id;
          reader[MID] = MID;
          // 방 참여 여부 노티
          if (notification.android._notification._data.msg === CHAT_ROOM_IN) {
            console.log('chat Room In Noti');
            // get ChattingList
            var userRef = firebase
              .database()
              .ref('chatRoomList/' + this.state.roomKey + '/chatList/');
            userRef.once('value', dataSnapshot => {
              getChatList = [];
              dataSnapshot.forEach(child => {
                getChatList.push({
                  key: child.key,
                  user: child.val().user,
                  msg: child.val().msg,
                  date: child.val().date,
                  read: child.val().read,
                  place: child.val().place,
                });
              });

              // 읽음표시 처리
              if (
                getChatList.length > 0 &&
                getChatList[getChatList.length - 1].read[this.state.id] ===
                  this.state.id &&
                getChatList[getChatList.length - 1].read[MID] === MID
              ) {
                getChatList.forEach((child, index) => {
                  getChatList[index].read = reader;
                });
              }
            });
            this.setState({
              unReadCount: 0,
            });
          } else {
            console.log('메시지 받음');
            if (notification.android._notification._data.roomKey === roomKey) {
              var userRef = firebase
                .database()
                .ref('chatRoomList/' + this.state.roomKey + '/chatList/');
              userRef.once('value', dataSnapshot => {
                getChatList = [];
                dataSnapshot.forEach(child => {
                  getChatList.push({
                    key: child.key,
                    user: child.val().user,
                    msg: child.val().msg,
                    date: child.val().date,
                    read: reader,
                    place: child.val().place,
                  });
                });
              });
              if (
                notification.android._notification._data.msg === RESPONSE_OK
              ) {
                Alert.alert(
                  '배틀신청을 수락했습니다.',
                  '나의 배틀에 가서 배틀현황을 확인하세요 !',
                );
                let count = this.state.unReadCount;
                count--;
                this.setState({
                  unReadCount: count,
                });
                // 안읽은 메시지 카운트 표시
                firebase
                  .database()
                  .ref('chatRoomList/' + this.state.roomKey + '/unReadCount')
                  .update({
                    [this.state.myId]: count,
                    [this.state.id]: 0,
                  });
              } else if (
                notification.android._notification._data.msg === ROOM_OUT
              ) {
                this.setState({deleteRoomCheck: true});
                this.props.navigation.goBack();
                this.props.navigation.state.params.outCheck({
                  roomOutCheck: true,
                  roomKey: this.state.roomKey,
                });
              }
            } else {
              if (notification.android._notification._data.msg !== ROOM_OUT) {
                this.refs.toast.show(
                  notification.android._notification._data.name +
                    ' : ' +
                    notification.android._notification._data.msg,
                );
              } else {
                this.refs.toast.show(
                  notification.android._notification._data.name +
                    '님이 채팅방을 나갔습니다.',
                );
              }
            }
          }
          this.setState({
            getChatList: getChatList,
          });
        },
      );
    } else {
      try {
        Firebase.messaging().requestPermission();
      } catch (error) {
        alert('user reject permission');
      }
    }

    try {
      // get battleState
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/battleState')
        .on('value', dataSnapshot => {
          let state = JSON.stringify(dataSnapshot);
          if (state === '"배틀신청중"') {
            state = '배틀신청중';
          } else if (state === '"배틀요청"') {
            state = '배틀요청';
          } else if (state === '"배틀진행중"') {
            state = '배틀진행중';
          } else {
            state = '배틀종료';
          }
          console.log('[BattleTalk]######### battleState: ' + state);
          console.log(state);
          this.setState({
            battleState: state,
          });
        });
      // get requestUser
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/requestUser')
        .on('value', dataSnapshot => {
          this.setState({
            requestUser: JSON.stringify(dataSnapshot),
          });
        });
      let makerIn;
      let joinerIn;
      // get makeUser
      var maker = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userId');
      maker.once('value', dataSnapshot => {
        this.setState({
          makeUser: JSON.stringify(dataSnapshot),
        });
      });
      // get joinUser
      var joiner = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/joinUser/userId');
      joiner.once('value', dataSnapshot => {
        this.setState({
          joinUser: JSON.stringify(dataSnapshot),
        });
      });
      var checkMaker = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userIn');
      checkMaker.once('value', dataSnapshot => {
        makerIn = JSON.stringify(dataSnapshot);
      });
      console.log('\n3\n');
      var checkJoiner = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/joinUser/userIn');
      checkJoiner.once('value', dataSnapshot => {
        joinerIn = JSON.stringify(dataSnapshot);
      });
      // get ChattingList
      var userRef = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/chatList/');
      // .limitToLast(30);
      // .orderByChild('key');
      userRef.once('value', dataSnapshot => {
        getChatList = [];
        dataSnapshot.forEach(child => {
          // child.val().read[this.state.myId] = this.state.myId;
          getChatList.push({
            key: child.key,
            user: child.val().user,
            msg: child.val().msg,
            date: child.val().date,
            read: child.val().read,
            place: child.val().place,
          });
          this.setState({
            getChatList: getChatList,
            // loading: false,
          });
        });
      });
      // 내 로그인 정보 불러오ß기
      this.getData();
      this.updateSingleData(this.state.roomKey, getChatList);
      if (
        (JSON.stringify(MID) === this.state.makeUser && joinerIn === 'true') ||
        (JSON.stringify(MID) === this.state.joinUser && makerIn === 'true')
      ) {
        console.log("i'm in");
        //('상대방이 들어와있다면 내가 들어온것을 알린다');
        // fcm
        let otherToken;
        firebase
          .database()
          .ref('FcmTokenList/' + this.state.id)
          .once('value', dataSnapshot => {
            otherToken = dataSnapshot;
            FirebasePush.sendToServerBattleTalk(
              this.state.roomKey,
              this.state.id,
              MID,
              MNAME,
              '',
              CHAT_ROOM_IN,
              '',
              otherToken,
            );
          });
      }
      // 안읽은 메시지 카운트 표시
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/unReadCount')
        .update({
          [MID]: 0,
        });
      // 상대방이 나갔을 때
      var checkDeleteChat = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/deleteChat');
      checkDeleteChat.on('value', dataSnapshot => {
        this.setState({
          deleteChat: dataSnapshot.val(),
        });
      });

      // 배틀톡, 스포츠배틀 취소된 리스트 확인
      if (
        this.state.container === 'BattleTalkList' ||
        this.state.container === 'SportsBattle'
      ) {
        let deleteUser = {};
        firebase
          .database()
          .ref('chatRoomList/' + this.state.roomKey + '/deleteBattle')
          .once('value', dataSnapshot => {
            deleteUser = dataSnapshot.val();
          });
        if (deleteUser[this.state.id] === this.state.id) {
          this.setState({deleteRoomCheck: true});
          this.props.navigation.goBack();
          this.props.navigation.state.params.outCheck({
            roomOutCheck: true,
            roomKey: this.state.roomKey,
          });
        }
      }

      // 배틀용 시설 확인
      this.onBattlePlaceListChanging();
    } catch (error) {
      console.log('get chattingList error ::: ' + error);
    }
  }

  settingFinish = async () => {
    this.setState({
      loading: false,
    });
  };

  // BattlePlace List
  onBattlePlaceListChanging = async () => {
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    let listChanged = [];
    try {
      await LESPO_API.getBattlePlaceList(config)
        .then(response => {
          listChanged = response.data.data;
          this.setState({
            battlePlace: listChanged.length,
          });
        })
        .catch(error => {
          console.log('get BattlePlaceList fail: ' + error);
        });
    } catch (error) {
      console.log("Cant't get Battle place marker. : " + error);
    }
  };

  resetNotiData = async () => {
    await AsyncStorage.setItem('@NOTI_ROOMKEY', '');
    await AsyncStorage.setItem('@NOTI_ID', '');
    await AsyncStorage.setItem('@NOTI_NAME', '');
    await AsyncStorage.setItem('@NOTI_PROFILE', '');
  };

  setData = async data => {
    console.log('setData::: ', data);
    let API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    console.log(API_TOKEN);
    const config = {
      headers: {
        Authorization: API_TOKEN,
      },
    };
    await LESPO_API.getCoin(config)
      .then(response => {
        this.setState({
          coin: response.data.data.credit,
        });
        console.log('myCoin Get: ' + response.data.data.credit);
      })
      .catch(error => {
        console.log('getCoin fail: ' + error);
      });
    if (data === 'battleStart') {
      if (this.state.coin > 0) {
        this.refs.toast.show('배틀을 신청했습니다.');
        this.updateState(M_ID, 'request');
      } else {
        this.refs.toast.show('사용가능한 코인이 부족합니다.');
      }
    } else if (data === 'requestOK') {
      firebase
        .database()
        .ref('APITokenList/' + this.state.id)
        .once('value', dataSnapshot => {
          let otherToken = JSON.stringify(dataSnapshot);
          otherToken = otherToken.replace('"', '');
          otherToken = otherToken.replace('"', '');
          console.log(otherToken.length);
          let otherConfig = {
            headers: {
              Authorization: otherToken,
            },
          };
          this.otherCoinGet(otherConfig);
        });
    }
  };

  otherCoinGet = async otherConfig => {
    let MID = await AsyncStorage.getItem('@USER_ID');
    let MNAME = await AsyncStorage.getItem('@USER_NAME');
    let otherCoin;
    try {
      await LESPO_API.getCoin(otherConfig)
        .then(response => {
          // console.log(JSON.stringify(response));
          this.setState({
            otherCoin: response.data.data.credit,
          });
          otherCoin = response.data.data.credit;
          console.log('otherCoin[1]: ' + this.state.coin);
          console.log('otherCoin[2]: ' + otherCoin);
          // 코인 검사
          if (this.state.coin > 0) {
            if (this.state.otherCoin > 0) {
              // 배틀 시작
              this.setState({
                battleState: '배틀진행중',
              });
              this.updateState(M_ID, 'OK');
              // this.refs.toast.show('배틀신청을 수락했습니다.');
              Alert.alert(
                '배틀신청을 수락했습니다.',
                '나의 배틀에 가서 배틀현황을 확인하세요 !',
              );
              // fcm
              let otherToken;
              firebase
                .database()
                .ref('FcmTokenList/' + this.state.id)
                .once('value', dataSnapshot => {
                  otherToken = dataSnapshot;
                  FirebasePush.sendToServerBattleTalk(
                    this.state.roomKey,
                    this.state.id,
                    MID,
                    MNAME,
                    '',
                    RESPONSE_OK,
                    '',
                    otherToken,
                  );
                });
            } else {
              // 상대 코인 부족
              console.log('상대방의 코인 갯수: ' + this.state.otherCoin);
              this.refs.toast.show('상대방의 코인이 부족합니다.');
            }
          } else {
            // 내 코인 부족
            this.refs.toast.show('사용가능한 코인이 부족합니다.');
          }
        })
        .catch(error => {
          if (error === 'Error: Network Error') {
            alert.toString('다시한번 시도해 주세요.');
          }
          console.log('otherCoin Get fail: ' + error);
        });
    } catch (error) {
      console.log('otherCoin fail: ' + error);
    }
  };

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  // AppState Check
  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      this._chatRoomUserIn();
    } else {
      this._chatRoomUserOut();
      console.log('App has go to the background!');
    }
    this.setState({appState: nextAppState});
  };

  _chatRoomUserOut = async () => {
    if (this.state.makeUser === JSON.stringify(this.state.myId)) {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/makeUser')
        .update({
          userIn: false,
        })
        .then(data => {
          //success callback
          console.log('makeUser OUT: ', data);
        })
        .catch(error => {
          //error callback
          console.log('makeUser OUT error ', error);
        });
    } else {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/joinUser')
        .update({
          userIn: false,
        })
        .then(data => {
          //success callback
          console.log('joinUser OUT: ', data);
        })
        .catch(error => {
          //error callback
          console.log('joinUser OUT error ', error);
        });
    }
    this.setState({
      loading: true,
    });
  };

  _chatRoomUserIn = async () => {
    // 읽음표시 == 0
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/unReadCount')
      .update({
        [this.state.myId]: 0,
      });

    let deleteUser = {};
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/deleteBattle')
      .once('value', dataSnapshot => {
        this.setState({
          deleteUser,
        });
        deleteUser = dataSnapshot.val();
      });

    // Alert.alert(deleteUser[this.state.id], '\n======\n' + this.state.id);

    if (deleteUser[this.state.id] === this.state.id) {
      this.setState({deleteRoomCheck: true});
      this.props.navigation.goBack();
      this.props.navigation.state.params.outCheck({
        roomOutCheck: true,
        roomKey: this.state.roomKey,
      });
    } else if (
      deleteUser[this.state.id] !== this.state.id &&
      (this.state.container === 'BattleTalkList' ||
        this.state.container === 'SportsBattle')
    ) {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/deleteBattle')
        .on('value', dataSnapshot => {
          this.setState({
            deleteUser,
          });
          deleteUser = dataSnapshot.val();
          let flag = '';
          if (deleteUser[this.state.id] === this.state.id) {
            // Alert.alert('=======');
            flag = 'delete';
            firebase
              .database()
              .ref('chatRoomList/' + this.state.roomKey + '/deleteBattle')
              .off('value');
            this.setState({deleteRoomCheck: true});
            this.props.navigation.goBack();
            this.props.navigation.state.params.outCheck({
              roomOutCheck: true,
              roomKey: this.state.roomKey,
            });
          } else {
            setTimeout(() => {
              if (flag !== 'delete' && !this.state.deleteRoomCheck) {
                // if (deleteUser[this.state.id] !== null) {
                // Alert.alert('------');
                this.defaultRoomIn();
                firebase
                  .database()
                  .ref('chatRoomList/' + this.state.roomKey + '/deleteBattle')
                  .off('value');
              }
            }, 2000);
          }
        });
    } else {
      this.defaultRoomIn();
    }
  };

  defaultRoomIn = () => {
    if (this.state.makeUser === JSON.stringify(this.state.myId)) {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/makeUser')
        .update({
          userIn: true,
        })
        .then(data => {
          //success callback
          console.log('makeUser IN: ', data);
        })
        .catch(error => {
          //error callback
          console.log('makeUser IN error ', error);
        });
    } else {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/joinUser')
        .update({
          userIn: true,
        })
        .then(data => {
          //success callback
          console.log('joinUser IN: ', data);
        })
        .catch(error => {
          //error callback
          console.log('joinUser IN error ', error);
        });
    }

    let joinerIn, makerIn;
    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
    console.log('\n4\n');
    var checkJoiner = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/joinUser/userIn');
    checkJoiner.once('value', dataSnapshot => {
      joinerIn = JSON.stringify(dataSnapshot);
    });
    if (
      (JSON.stringify(this.state.myId) === this.state.makeUser &&
        joinerIn === 'true') ||
      (JSON.stringify(this.state.myId) === this.state.joinUser &&
        makerIn === 'true')
    ) {
      console.log('상대방이 들어와있다면 내가 들어온것을 알린다');
      // fcm
      let otherToken;
      firebase
        .database()
        .ref('FcmTokenList/' + this.state.id)
        .once('value', dataSnapshot => {
          otherToken = dataSnapshot;
          FirebasePush.sendToServerBattleTalk(
            this.state.roomKey,
            this.state.id,
            this.state.myId,
            this.state.myName,
            '',
            CHAT_ROOM_IN,
            '',
            otherToken,
          );
        });
      // 안읽은 메시지 카운트 표시
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/unReadCount')
        .update({
          [this.state.myId]: 0,
        });
    }

    // chatList 추가
    // get ChattingList
    var userRef = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/chatList/');
    // .limitToLast(30);
    // .orderByChild('key');
    userRef.on('value', dataSnapshot => {
      let getChatList = [];
      dataSnapshot.forEach(child => {
        let reader = child.val().read;
        reader[this.state.myId] = this.state.myId;
        //child.val().read[this.state.myId] = this.state.myId;
        getChatList.push({
          key: child.key,
          user: child.val().user,
          msg: child.val().msg,
          date: child.val().date,
          read: reader,
          place: child.val().place,
        });
      });

      // iOS 전원버튼 background 예외처리
      if (
        Platform.OS === 'ios' &&
        getChatList.length === this.state.getChatList.length
      ) {
        // setTimeout(() => {
        //   this.getChatList();
        // }, 1000);
        // console.log('ㅇㅏ직켜져있다.');
        // Alert.alert('아직켜져있다');
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 2000);
      } else {
        // Alert.alert(JSON.stringify('=== OFF ==='), JSON.stringify(getChatList));
        firebase
          .database()
          .ref('chatRoomList/' + this.state.roomKey + '/chatList/')
          .off('value');
        this.setState({
          loading: false,
        });
        // this.updateSingleData(this.state.roomKey, this.state.getChatList);
        // this.getChatList();
      }
      this.setState({
        getChatList: getChatList,
      });
    });
  };

  unMountRestet = async unMount => {
    this.updateSingleData(this.state.roomKey, this.state.getChatList);
    // let reader = {};
    // reader[this.state.myId] = this.state.myId;
    // reader[this.state.id] = this.state.id;
    // // 읽음표시
    // firebase
    //   .database()
    //   .ref('chatRoomList/' + this.state.roomKey + '/chatList')
    //   .once('value', dataSnapshot => {
    //     dataSnapshot.forEach(child => {
    //       firebase
    //         .database()
    //         .ref(
    //           'chatRoomList/' + this.state.roomKey + '/chatList/' + child.key,
    //         )
    //         .update({
    //           read: reader,
    //         });
    //     });
    //   });
  };

  // Screen OUT
  componentWillUnmount() {
    console.log('componentWillUnmount ::: [BattleTalk Container]');
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.removeToastListener();
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/battleState')
      .off('value');
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/requestUser')
      .off('value');
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/deleteChat')
      .off('value');
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/chatList')
      .off('value');

    if (
      this.state.getChatList.length === 0 &&
      this.state.makeUser !== JSON.stringify(this.state.myId) &&
      !this.state.deleteRoomCheck
    ) {
      let joinUser = {
        userIn: false,
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
    } else {
      if (!this.state.deleteRoomCheck) {
        console.log('deleteRoomCheck ::: ' + this.state.deleteRoomCheck);
        console.log('chat length ::: ' + this.state.getChatList.length);
        this._chatRoomUserOut();
      } else if (
        this.state.container === 'BattleTalkList' ||
        this.state.container === 'SportsBattle'
      ) {
        firebase
          .database()
          .ref('chatRoomList/' + this.state.roomKey + '/deleteBattle')
          .off('value');
      }
    }
  }

  onSavePlace = async (place, navigation, locations, index) => {
    console.log('onSavePlace::: ' + place);
    locations = {
      latitude: locations.latitude,
      longitude: locations.longitude,
      index,
    };
    console.log(locations);
    navigation.goBack();
    // check user in room
    let makerIn;
    let joinerIn;
    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
    console.log('\n5\n');
    var checkJoiner = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/joinUser/userIn');
    checkJoiner.once('value', dataSnapshot => {
      joinerIn = JSON.stringify(dataSnapshot);
    });
    let reader = {};
    if ((makerIn === 'true') & (joinerIn === 'true')) {
      reader[this.state.myId] = this.state.myId;
      reader[this.state.id] = this.state.id;
    } else {
      reader[this.state.myId] = this.state.myId;
    }
    try {
      this.writeChattingAdd(
        this.state.roomKey,
        this.state.myId,
        place,
        moment()
          .local()
          .format('LT'),
        reader,
        locations,
      );
    } catch (error) {
      console.log('insert Chatting message error ::: ' + error);
    }
  };

  render() {
    const {
      loading,
      notiCheck,
      getChatList,
      msg,
      profile,
      name,
      myProfile,
      myName,
      myId,
      id,
      battleState,
      requestUser,
      deleteChat,
      unMount,
      battlePlace,
    } = this.state;
    return (
      <>
        <BattleTalkPresenter
          loading={loading}
          notiCheck={notiCheck}
          getChatList={getChatList}
          insertChatList={this.insertChatList}
          msgHandler={this.msgHandler}
          msg={msg}
          // 상대 정보
          id={id}
          profile={profile}
          name={name}
          // 내 정보
          myId={myId}
          myName={myName}
          myProfile={myProfile}
          battleState={battleState}
          requestUser={requestUser}
          // 채팅방 나갔는지
          deleteChat={deleteChat}
          changeModalVisiblity={this.changeModalVisiblity}
          onSavePlace={this.onSavePlace}
          unMount={unMount}
          battlePlace={battlePlace}
        />
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            battleState={battleState}
            battleStart={'배틀시작'}
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
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
