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
      Firebase.notifications().onNotification(notification => {
        this.refs.toast.show(
          notification.android._notification._data.name +
            ' : ' +
            notification.android._notification._data.msg,
        );
      });
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
    let {roomKey, myId} = this.state;
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

  setData = (data, rating) => {
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
      this.checkEndUser();
      this.changeModalVisiblity(true);
    } else if (data === 'start') {
      this.checkEndUser();
      this.addRating(rating);
      this.setState({isRandomBox: 'start'});
      this.changeModalVisiblity(true);
    } else if (data === 'success') {
      this.setState({isRandomBox: 'success'});
      this.changeModalVisiblity(true);
    } else if (data === 'fail') {
      this.setState({isRandomBox: 'fail'});
      this.changeModalVisiblity(true);
    } else {
      // Dialog 취소
      console.log('cancel dialog');
    }
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
