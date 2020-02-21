import React from 'react';
import {Modal, Platform} from 'react-native';
import SimpleDialog from '../../../components/SimpleDialog';
import MyBattleDetailPresenter from './MyBattleDetailPresenter';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {LESPO_API} from '../../../api/Api';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import RNKakaoPlusFriend from 'react-native-kakao-plus-friend';

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
            level,
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
      level,
      myId: '',
      myName: '',
      myProfile: '',
      isModalVisible: false,
      isRandomBox: '',
      endCheck: '',
      roomMaker: '',
      win: '',
      lose: '',
      error: null,
      navigation,
    };
    console.log('room ID :' + JSON.stringify(roomKey));
    console.log('user ID :' + JSON.stringify(id));
  }

  // 시작시 불러옴
  async componentDidMount() {
    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      // 화면에 들어와있을 때 알림
      this.removeToastListener = Firebase.notifications().onNotification(
        notification => {
          if (
            notification.android._notification._data.msg !==
            '~!@채팅방들어와서확인함~!@'
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                ' : ' +
                notification.android._notification._data.msg,
            );
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

      var checkEnd = firebase
        .database()
        .ref(
          'chatRoomList/' + this.state.roomKey + '/endUser/' + this.state.myId,
        );
      checkEnd.on('value', dataSnapshot => {
        let check = JSON.stringify(dataSnapshot);
        this.setState({
          endCheck: check,
        });
        console.log(this.state.endCheck);
      });

      var battleState = firebase
        .database()
        .ref('chatRoomList/' + this.state.roomKey + '/battleState');
      battleState.on('value', dataSnapshot => {
        let state = JSON.stringify(dataSnapshot);
        if (state === '"배틀신청중"') {
          state = '배틀신청중';
        } else if (state === '"배틀진행중"') {
          state = '배틀진행중';
        } else {
          state = '배틀종료';
        }
        console.log('######### battleState: ' + state);
        this.setState({
          statusText: state,
          loading: false,
        });
      });
    } catch (error) {
      console.log(error);
      error = "Cnat't get chatRoom makeUserId";
    }
  }

  battleState = state => {
    console.log('battleState: ' + state);
  };

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  setData = (data, rating, result) => {
    const {myId, roomMaker} = this.state;
    console.log('setData::: ', data);
    if (data === 'battleCancel') {
      // this.props.navigation.navigate({routeName: 'Login'});
      // 배틀 취소 [ 방장 / 참여자 ]
      if (JSON.stringify(myId) === roomMaker) {
        console.log('i am roomMaker');
        this.deleteChatRoom();
      } else {
        console.log('i am joinUser');
        this.outChatRoom();
      }
    } else if (data === 'battleEnd') {
      // 배틀 종료 및 평가하기
      this.endBattle();
      this.checkEndUser();
      this.changeModalVisiblity(true);
    } else if (data === 'start') {
      this.getBattleResult(rating, result);
    } else if (data === 'success') {
      this.setState({isRandomBox: 'success'});
      this.changeModalVisiblity(true);
    } else if (data === 'success2') {
      this.setState({isRandomBox: 'success2'});
      this.changeModalVisiblity(true);
    } else if (data === 'success3') {
      this.setState({isRandomBox: 'success3'});
      this.changeModalVisiblity(true);
    } else if (data === 'success4') {
      this.setState({isRandomBox: 'success4'});
      this.changeModalVisiblity(true);
    } else if (data === 'success5') {
      this.setState({isRandomBox: 'success5'});
      this.changeModalVisiblity(true);
    } else if (data === 'success6') {
      this.setState({isRandomBox: 'success6'});
      this.changeModalVisiblity(true);
    } else if (data === 'success7') {
      this.setState({isRandomBox: 'success7'});
      this.changeModalVisiblity(true);
    } else if (data === 'fail') {
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
      } else {
        this.updateBattleResult('win', myId);
        this.changeModalVisiblity(false);
        this.checkEndUser();
        this.addRating(rating);
        this.setState({isRandomBox: 'start'});
        this.changeModalVisiblity(true);
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
      }
    }
  };

  endBattle = async () => {
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
      let msg = '배틀을 종료합니다.';
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
      let msg = '배틀을 종료합니다.';
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
            '배틀을 종료합니다.',
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
        lastMsg: '배틀을 종료합니다.',
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
    await RNKakaoPlusFriend.chat('_fxdMxlxb');
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
    params.append('to', 'withmind.sns@gmail.com');
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
    let endUser = {};
    endUser[this.state.myId] = true;
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/endUser')
      .update({
        [this.state.myId]: true,
      })
      .then(data => {
        //success callback
        console.log('endUser Check: ', JSON.stringify(data));
        this.setState({
          endCheck: true,
        });
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
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
    const {roomKey, myId} = this.state;
    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/endUser/' + myId)
      .off();

    firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/battleState')
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
