import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import BattleTalkPresenter from './BattleTalkPresenter';
import {Modal, Alert} from 'react-native';
import SimpleDialog from '../../../components/SimpleDialog';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {LESPO_API} from '../../../api/Api';

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
      otherToken: '',
      otherCoin: 0,
      coin: 0,
      myId: '',
      myName: '',
      myProfile: '',
      myRating: 5,
      loading: true,
      getChatList: [],
      insertChatList: null,
      msg: null,
      battlePlace: '',
      makeUser: '',
      isModalVisible: false,
      battleState: '',
      error: null,
    };
    console.log('@@@@@@@: battleTalk' + this.state.makeUser);
  }

  updateState = async () => {
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
      let msg = '배틀을 시작합니다';
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
      let msg = '배틀을 시작합니다';
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
            '배틀을 시작합니다.',
            otherToken,
          );
        });
    }
    let endUser = {};
    endUser[this.state.id] = this.state.id;
    endUser[this.state.myId] = this.state.myId;

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
        lastMsg: '배틀을 시작합니다.',
        battleState: '배틀진행중',
        endUser,
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
        console.log('writeChatting Add: ', data);
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
          msg,
          otherToken,
        );
      });
    this.setState({
      msg: '',
    });
  }

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
        } catch (error) {
          console.log('insert Chatting message error ::: ' + error);
        }
      }
    } else {
      console.log('message : null');
    }
  };

  // 체팅방 들어와있는지 상태 체크 [읽음표시]
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
      console.log('check :::: chatList UPDATE');
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
        if (this.state.makeUser !== JSON.stringify(this.state.myId)) {
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
            })
            .catch(error => {
              //error callback
              console.log('error ', error);
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
              console.log('joinUser Add: ', data);
            })
            .catch(error => {
              //error callback
              console.log('error ', error);
            });
        }
      } else {
        console.log('Login profile image null');
      }
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

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

  // init 초기값
  async componentDidMount() {
    // fcm setting
    // const enable = await Firebase.messaging().hasPermission();
    // if (enable) {
    // Firebase.notifications().onNotification(notification => {
    // alert('notification._android');
    // console.log(
    //   'get FCM msg : ' + notification.android._notification._data,
    // );
    // });
    // } else {
    //   try {
    //     Firebase.messaging().requestPermission();
    //   } catch (error) {
    //     alert('user reject permission');
    //   }
    // }
    let {roomKey, getChatList} = this.state;
    try {
      // get battleState
      firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/battleState/')
        .on('value', dataSnapshot => {
          this.setState({
            battleState: JSON.stringify(dataSnapshot),
          });
        });
      // get makeUser
      var maker = firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/makeUser/userId');
      maker.once('value', dataSnapshot => {
        this.setState({
          makeUser: JSON.stringify(dataSnapshot),
        });
      });
      // get ChattingList
      var userRef = firebase
        .database()
        .ref('chatRoomList/' + roomKey + '/chatList/')
        .limitToLast(30);
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
        // console.log(
        //   'Firebase get chattingList Finish----------     ' +
        //     JSON.stringify(dataSnapshot),
        // );
      });
      // 내 로그인 정보 불러오ß기
      this.getData(roomKey, getChatList);
      console.log(
        'chatList Data[try 1]: ' + JSON.stringify(this.state.battleState),
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

  setData = async data => {
    console.log('setData::: ', data);
    if (data === 'battleStart') {
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

      firebase
        .database()
        .ref('APITokenList/' + this.state.id)
        .once('value', dataSnapshot => {
          let otherToken = JSON.stringify(dataSnapshot);
          console.log(otherToken.length);
          otherToken = otherToken.substring(1, 961);
          console.log(otherToken);
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
    let otherCoin;
    try {
      await LESPO_API.getCoin(otherConfig)
        .then(response => {
          // console.log(JSON.stringify(response));
          this.setState({
            otherCoin: response.data.data.credit,
          });
          otherCoin = response.data.data.credit;
          console.log('otherCoin[1]: ' + response.data.data.credit);
          console.log('otherCoin[2]: ' + otherCoin);
          // 코인 검사
          if (this.state.coin > 0) {
            if (this.state.otherCoin > 0) {
              // 배틀 시작
              this.setData({
                battleState: '배틀진행중',
              });
              this.updateState();
              this.refs.toast.show('배틀신청이 완료되었습니다.');
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
          console.log('otherCoin Get fail: ' + error);
        });
    } catch (error) {
      console.log('otherCoin fail: ' + error);
    }
  };

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  // Screen OUT
  componentWillUnmount() {
    console.log('componentWillUnmount ::: [BattleTalk Container]');
    // this.state.getChatList.forEach(child => {
    //   console.log('getChild: ' + JSON.stringify(child));
    // });
    if (
      this.state.getChatList.length === 0 &&
      this.state.makeUser !== JSON.stringify(this.state.myId)
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
      if (this.state.makeUser !== JSON.stringify(this.state.myId)) {
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
      } else {
        firebase
          .database()
          .ref('chatRoomList/' + this.state.roomKey + '/makeUser')
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
    }

    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/chatList/')
      .off('value');
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/battleState/')
      .off('value');
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/makeUser/userIn')
      .off('value');
    firebase
      .database()
      .ref('chatRoomList/' + this.state.roomKey + '/joinUser/userIn')
      .off('value');
  }

  onSavePlace = async (place, navigation) => {
    console.log('onSavePlace::: ' + place);
    navigation.goBack();

    let reader = {};
    reader[this.state.myId] = this.state.myId;
    try {
      await this.writeChattingAdd(
        this.state.roomKey,
        this.state.myId,
        place,
        moment()
          .local()
          .format('LT'),
        reader,
      );
    } catch (error) {
      console.log('insert Chatting message error ::: ' + error);
    }
  };

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
      battleState,
    } = this.state;
    return (
      <>
        <BattleTalkPresenter
          loading={loading}
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
          battleState={battleState}
          changeModalVisiblity={this.changeModalVisiblity}
          onSavePlace={this.onSavePlace}
        />
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            battleState={'배틀시작'}
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
