import React from 'react';
import {Modal, Linking, Platform} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import SimpleDialog from '../../../components/SimpleDialog';
import MyBattleDetailPresenter from './MyBattleDetailPresenter';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {LESPO_API} from '../../../api/Api';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import RNKakaoPlusFriend from 'react-native-kakao-plus-friend';
import {CHAT_ROOM_IN} from '../../../constants/Strings';

var M_ID, M_NAME, M_PROFILE;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const {
      navigation: {
        state: {
          params: {
            roomKey,
            id,
            profile,
            name,
            sport,
            type,
            date,
            area,
            memo,
            statusText,
            battleResult,
            level,
            requestUser,
          },
        },
      },
    } = props;
    this.state = {
      loading: true,
      roomKey,
      id,
      profile,
      name,
      sport,
      type,
      date,
      area,
      memo,
      statusText,
      battleResult,
      level,
      requestUser,
      myId: '',
      myName: '',
      myProfile: '',
      isModalVisible: false,
      isRandomBox: '',
      endCheck: '',
      endUser1: '',
      endUser2: '',
      openBox: false,
      roomMaker: '',
      error: null,
      navigation,
    };
    console.log('room ID :' + JSON.stringify(roomKey));
    console.log('user ID :' + JSON.stringify(id));
    console.log('statusText :' + statusText);
  }

  // 시작시 불러옴
  async componentDidMount() {
    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      // 화면에 들어와있을 때 알림
      this.removeToastListener = Firebase.notifications().onNotification(
        notification => {
          if (notification.android._notification._data.msg !== CHAT_ROOM_IN) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                ' : ' +
                notification.android._notification._data.msg,
            );
            var battleState = firebase
              .database()
              .ref('chatRoomList/' + this.state.roomKey + '/battleState');
            battleState.on('value', dataSnapshot => {
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
              this.setState({
                statusText: state,
              });
            });
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

    this.init();
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        console.log('willFocus ::: reload');
        this.setState({
          loading: true,
        });
        this.init();
      }),
    ];
  }
  init = async () => {
    console.log('init [MyBattleDetail] ');
    let maker;
    try {
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

      var userRef = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userId/');
      userRef.once('value', dataSnapshot => {
        maker = JSON.stringify(dataSnapshot);
        this.setState({
          roomMaker: maker,
        });
      });

      let state;
      var battleState = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/battleState');
      battleState.on('value', dataSnapshot => {
        state = JSON.stringify(dataSnapshot);
        console.log('여기 확인해\n' + state);
        if (state === '"배틀신청중"') {
          state = '배틀신청중';
        } else if (state === '"배틀요청"') {
          state = '배틀요청';
        } else if (state === '"배틀진행중"') {
          state = '배틀진행중';
        } else if (state === 'null') {
          state = '배틀취소';
        } else {
          state = '배틀종료';
        }
        console.log('[MyBattleDetail]######### battleState: ' + state);
        console.log(state);
        this.setState({
          statusText: state,
        });
      });

      var requestUser = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/requestUser');
      requestUser.on('value', dataSnapshot => {
        let user = JSON.stringify(dataSnapshot);
        this.setState({
          requestUser: user,
        });
      });

      let winner;
      let loser;
      let endUser1, endUser2;
      let openBox;
      var randomBox = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/openBox');
      randomBox.once('value', dataSnapshot => {
        openBox = JSON.stringify(dataSnapshot);
        this.setState({
          openBox,
        });
      });

      var endCheck = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/endUser');
      endCheck.on('value', dataSnapshot => {
        endUser1 = dataSnapshot.val().user1;
        endUser2 = dataSnapshot.val().user2;
        this.setState({
          endUser1,
          endUser2,
        });
        if (
          endUser1 === M_ID ||
          endUser2 === M_ID ||
          (endUser1 !== '' && endUser2 === M_ID) ||
          (endUser1 === M_ID && endUser2 !== '')
        ) {
          this.setState({
            endCheck: M_ID,
          });
        } else if (endUser1 !== '' && endUser2 !== '') {
          this.setState({
            endCheck: '',
          });
        }
      });
      var battleWin = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/battleResult/win');
      battleWin.on('value', dataSnapshot => {
        console.log('who is winner: ' + JSON.stringify(dataSnapshot));
        winner = JSON.stringify(dataSnapshot);
      });
      var battleLose = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/battleResult/lose');
      battleLose.on('value', dataSnapshot => {
        console.log('who is loser: ' + JSON.stringify(dataSnapshot));
        loser = JSON.stringify(dataSnapshot);
      });

      if (
        this.state.statusText === '배틀종료' &&
        winner === JSON.stringify(M_ID) &&
        loser !== '""' &&
        endUser1 !== '' &&
        endUser2 !== '' &&
        openBox === 'false'
      ) {
        this.setState({isRandomBox: 'start', loading: false});
        this.changeModalVisiblity(true);
      }
      this.setState({
        loading: false,
      });

      // else if (
      //   this.state.statusText === '배틀종료' &&
      //   winner !== JSON.stringify(M_ID) &&
      //   loser === '""' &&
      //   endUser1 !== '' &&
      //   endUser2 === ''
      // ) {
      //   this.changeModalVisiblity(true);
      // }
    } catch (error) {
      console.log(error);
      error = "Cnat't get chatRoom makeUserId";
    }
  };

  battleState = state => {
    console.log('battleState: ' + state);
  };

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  requestOK = async () => {
    // check user in room
    let makerIn;
    let joinerIn;
    let user = this.state.myId;
    let msg = '배틀을 수락합니다.';
    let battleState = '배틀진행중';
    let date = moment()
      .local()
      .format('LT');
    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
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
        .push({user, msg, date, read: reader})
        .then(data => {
          //success callback
          console.log('battle start notice Add: ', data);
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
    } else {
      let reader = {};
      reader[this.state.myId] = this.state.myId;

      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/chatList')
        .push({user, msg, date, read: reader})
        .then(data => {
          //success callback
          console.log('battle start notice Add: ', data);
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
    }
    // fcm
    let otherToken;
    firebase
      .database()
      .ref('FcmTokenList/' + this.state.id)
      .once('value', dataSnapshot => {
        otherToken = dataSnapshot;
        console.log(otherToken);
        this.sendToServer(
          this.state.myId,
          this.state.myName,
          this.state.myProfile,
          msg,
          otherToken,
        );
      });
    let endUser = {
      user1: '',
      user2: '',
    };

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
    this.setState({
      statusText: battleState,
    });
    this.coinCheckDelete();
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
        console.log(otherToken.length);
        otherToken = otherToken.substring(1, 961);
        console.log(otherToken);
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

  setData = (data, rating, result) => {
    const {myId, roomMaker, roomKey} = this.state;
    console.log('setData::: ', data);
    if (data === 'battleCancel') {
      firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/requestUser')
        .off();
      firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/endUser')
        .off();
      firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/battleState')
        .off();
      firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/battleResult/lose')
        .off();
      firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/battleResult/win')
        .off();
      // 배틀 취소 [ 방장 / 참여자 ]
      if (JSON.stringify(myId) === roomMaker) {
        console.log('i am roomMaker');
        this.deleteChatRoom();
      } else {
        console.log('i am joinUser');
        this.outChatRoom();
      }
    } else if (data === 'requestOK') {
      // 배틀신청 수락
      this.requestOK();
    } else if (data === 'battleEnd') {
      // 배틀 종료 및 평가하기
      this.endBattleFCM('battleEnd');
      this.checkEndUser();
      this.changeModalVisiblity(true);
    } else if (data === 'start') {
      this.getBattleResult(rating, result);
    } else if (data === 'success') {
      // coin
      this.addCoin();
      this.updateOpenBox();
      this.setState({isRandomBox: 'success'});
      this.changeModalVisiblity(true);
    } else if (data === 'success2') {
      this.updateOpenBox();
      this.setState({isRandomBox: 'success2'});
      this.changeModalVisiblity(true);
    } else if (data === 'success3') {
      this.updateOpenBox();
      this.setState({isRandomBox: 'success3'});
      this.changeModalVisiblity(true);
    } else if (data === 'success4') {
      this.updateOpenBox();
      this.setState({isRandomBox: 'success4'});
      this.changeModalVisiblity(true);
    } else if (data === 'success5') {
      this.updateOpenBox();
      this.setState({isRandomBox: 'success5'});
      this.changeModalVisiblity(true);
    } else if (data === 'success6') {
      this.updateOpenBox();
      this.setState({isRandomBox: 'success6'});
      this.changeModalVisiblity(true);
    } else if (data === 'success7') {
      this.updateOpenBox();
      this.setState({isRandomBox: 'success7'});
      this.changeModalVisiblity(true);
    } else if (data === 'fail') {
      this.updateOpenBox();
      this.setState({isRandomBox: 'fail'});
      this.changeModalVisiblity(true);
    } else if (data === 'Channel') {
      // 관리자연결 & Email
      this.sendEmail();
      this.chatChannel();
    } else {
      // Dialog 취소
      console.log('cancel dialog');
    }
  };

  addCoin = async () => {
    // 코인차감
    let API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: API_TOKEN,
      },
    };
    const params = new URLSearchParams();
    params.append('credit', 1);

    await LESPO_API.insertCoin(params, config)
      .then(response => {
        console.log('add coin success');
        this.refs.toast.show('코인 1개가 추가되었습니다.');
      })
      .catch(error => {
        console.log('addCoin fail: ' + error);
      });
  };

  updateOpenBox = async () => {
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey)
      .update({
        openBox: true,
      });
    this.setState({
      openBox: true,
    });
  };

  updateBattleResult = async (result, id) => {
    if (result === 'win') {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/battleResult')
        .update({
          win: id,
        });
    } else {
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/battleResult')
        .update({
          lose: id,
        });
    }
  };

  // battleResult check
  getBattleResult = async (rating, result) => {
    const {myId} = this.state;
    let winner;
    let loser;
    var battleWin = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/battleResult/win');
    battleWin.once('value', dataSnapshot => {
      console.log('who is winner: ' + JSON.stringify(dataSnapshot));
      winner = JSON.stringify(dataSnapshot);
    });
    var battleLose = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/battleResult/lose');
    battleLose.once('value', dataSnapshot => {
      console.log('who is loser: ' + JSON.stringify(dataSnapshot));
      loser = JSON.stringify(dataSnapshot);
    });

    if (result === 'win') {
      // 승자비교
      console.log('win: ' + winner);
      if (winner !== '""') {
        // 상대가 이미 승리 누름
        this.refs.toast.show('상대방이 승리에 체크했습니다.');
      } else if (winner === '""' && loser === '""') {
        this.updateBattleResult('win', myId);
        this.changeModalVisiblity(false);
        this.checkEndUser();
        this.addRating(rating);
        this.refs.toast.show('상대방의 평가가 끝나면 랜덤박스를 열수있습니다.');
      } else {
        this.updateBattleResult('win', myId);
        this.changeModalVisiblity(false);
        this.checkEndUser();
        this.addRating(rating);
        this.setState({isRandomBox: 'start'});
        this.changeModalVisiblity(true);
        this.updateOpenBox();
        // fcm
        let otherToken;
        firebase
          .database()
          .ref('FcmTokenList/' + this.state.id)
          .once('value', dataSnapshot => {
            otherToken = dataSnapshot;
            console.log(otherToken);
            this.sendToServer(
              this.state.myId,
              this.state.myName,
              this.state.myProfile,
              '평가를 완료했습니다.',
              otherToken,
            );
          });
      }
    } else {
      // 패자비교
      console.log('lose: ' + loser);
      if (loser !== '""') {
        // 상대가 이미 패배 누름
        this.refs.toast.show('상대방이 패배에 체크했습니다.');
      } else {
        this.updateBattleResult('lose', myId);
        this.changeModalVisiblity(false);
        this.checkEndUser();
        this.addRating(rating);
        this.setState({isRandomBox: 'fail'});
        this.changeModalVisiblity(true);
        this.endBattleFCM('end');
      }
    }
  };

  endBattleFCM = async msg => {
    let statusMsg;
    if (msg === 'battleEnd') {
      statusMsg = '배틀을 종료합니다.';
    } else {
      statusMsg = '평가를 완료했습니다.';
    }
    // check user in room
    let makerIn;
    let joinerIn;
    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
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
      let user = this.state.myId;
      let msg = statusMsg;
      let date = moment()
        .local()
        .format('LT');
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/chatList')
        .push({user, msg, date, read: reader})
        .then(data => {
          //success callback
          console.log('battle start notice Add: ', data);
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
    } else {
      let reader = {};
      reader[this.state.myId] = this.state.myId;
      let user = this.state.myId;
      let msg = statusMsg;
      let date = moment()
        .local()
        .format('LT');
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/chatList')
        .push({user, msg, date, read: reader})
        .then(data => {
          //success callback
          console.log('battle start notice Add: ', data);
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
          console.log(otherToken);
          this.sendToServer(
            this.state.myId,
            this.state.myName,
            this.state.myProfile,
            statusMsg,
            otherToken,
          );
        });
    }
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
        lastMsg: statusMsg,
      });
  };
  // 배틀종료 FCM
  sendToServer = async (senderId, senderName, senderProfile, msg, token) => {
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
          roomKey: this.state.roomKey,
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
        console.error(error);
      });
  };

  //친구 추가 하기로 링크
  addFriendChannel = async () => {
    console.log('구매문의');
    const add = await RNKakaoPlusFriend.addFriend('_fxdMxlxb');
    console.log(add);
  };
  //바로 채팅하기로 링크
  chatChannel = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://pf.kakao.com/_fxdMxlxb/chat');
    } else {
      const chat = await RNKakaoPlusFriend.chat('_fxdMxlxb');
      console.log(chat);
    }
  };
  // send Email
  sendEmail = async () => {
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    let product = '';
    if (this.state.isRandomBox === 'success') {
      product = '코인';
    } else if (this.state.isRandomBox === 'success2') {
      product = '게토레이 240ml 캔';
    } else if (this.state.isRandomBox === 'success3') {
      product = '닥터유 에너지바';
    } else if (this.state.isRandomBox === 'success4') {
      product = '파워에이드 pet 600ml';
    } else if (this.state.isRandomBox === 'success5') {
      product = '스타벅스 아메리카노(ICE)';
    } else if (this.state.isRandomBox === 'success6') {
      product = '베스킨라빈스 파인트';
    } else if (this.state.isRandomBox === 'success7') {
      product = 'bbq 황금올리브치킨 반반 + 콜라 1.25L';
    }
    const params = new URLSearchParams();
    params.append(
      'message',
      '아이디: ' +
        this.state.myId +
        '\n' +
        '이름: ' +
        this.state.myName +
        '\n' +
        '당첨상품: ' +
        product,
    );
    params.append('to', 'lespojeju@naver.com');
    // params.append('to', 'lespojeju@naver.com');
    await LESPO_API.sendEmail(params, config)
      .then(response => {
        console.log(JSON.stringify(response.data.data));
      })
      .catch(error => {
        console.log('addRating fail: ' + error);
      });
  };

  // rating save to server
  addRating = async rating => {
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    const params = new URLSearchParams();
    params.append('chat-uuid', this.state.roomKey);
    params.append('target-userId', this.state.id);
    params.append('rating', rating);
    await LESPO_API.addRating(params, config)
      .then(response => {
        console.log(JSON.stringify(response.data.data));
      })
      .catch(error => {
        console.log('addRating fail: ' + error);
      });
  };

  // battleState === end => endUser Check
  checkEndUser = async () => {
    let user1, user2;
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/endUser')
      .once('value', dataSnapshot => {
        user1 = dataSnapshot.val().user1;
        user2 = dataSnapshot.val().user2;
      });
    if (user1 === '' || user1 === this.state.myId) {
      user1 = this.state.myId;
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/endUser')
        .update({
          user1,
        })
        .then(data => {
          //success callback
          console.log('endUser Check: ', JSON.stringify(data));
          this.setState({
            endCheck: this.state.myId,
          });
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
    } else {
      user2 = this.state.myId;
      firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/endUser')
        .update({
          user2,
        })
        .then(data => {
          //success callback
          console.log('endUser Check: ', JSON.stringify(data));
          this.setState({
            endCheck: this.state.myId,
          });
        })
        .catch(error => {
          //error callback
          console.log('error ', error);
        });
    }

    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey)
      .update({
        battleState: '배틀종료',
      })
      .then(
        this.setState({
          statusText: '배틀종료',
        }),
      );
  };

  // 방장이 나간다
  deleteChatRoom = async () => {
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
    this.props.navigation.goBack(null);
  };

  // 참여자가 나간다
  outChatRoom = async () => {
    let chatList = '';
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
        date: moment().format(),
        chatList,
        joinUser,
      })
      .then(data => {
        //success callback
        console.log('joinUser Out: ', data);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
    this.props.navigation.goBack(null);
  };

  componentWillUnmount() {
    console.log('componentWillUnmount[MyBattleDetailContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    this.subs.forEach(sub => sub.remove());
    const {roomKey, myId} = this.state;
    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/requestUser')
      .off();
    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/endUser')
      .off();
    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/battleState')
      .off();
    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/battleResult/lose')
      .off();
    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/battleResult/win')
      .off();
  }

  render() {
    const {
      loading,
      sport,
      type,
      date,
      area,
      memo,
      statusText,
      level,
      requestUser,
      chatRoomList,
      myId,
      myName,
      myProfile,
      name,
      id,
      profile,
      roomKey,
      roomMaker,
      endCheck,
      endUser1,
      endUser2,
      openBox,
      isRandomBox,
    } = this.state;
    return (
      <>
        <MyBattleDetailPresenter
          loading={loading}
          sport={sport}
          type={type}
          date={date}
          area={area}
          memo={memo}
          statusText={statusText}
          level={level}
          requestUser={requestUser}
          chatRoomList={chatRoomList}
          myId={myId}
          myProfile={myProfile}
          myName={myName}
          id={id}
          profile={profile}
          name={name}
          roomKey={roomKey}
          roomMaker={roomMaker}
          endCheck={endCheck}
          endUser1={endUser1}
          endUser2={endUser2}
          openBox={openBox}
          changeModalVisiblity={this.changeModalVisiblity}
        />
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            isRandomBox={isRandomBox}
            battleState={statusText}
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
        <Toast
          ref="toast"
          style={{backgroundColor: '#fee6d0'}}
          position="bottom"
          positionValue={150}
          fadeInDuration={500}
          // fadeOutDuration={1500}
          opacity={1}
          textStyle={{color: '#000000'}}
        />
      </>
    );
  }
}
