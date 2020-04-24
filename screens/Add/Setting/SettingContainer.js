import React from 'react';
import SettingPresenter from './SettingPresenter';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {CHAT_ROOM_IN, ROOM_OUT} from '../../../constants/Strings';
import {Platform} from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '설정',
    };
  };
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      id: '',
      alarm: true,
      navigation,
      error: null,
    };
  }

  alarmChange = async (val, id) => {
    if (val) {
      this.refs.toast.show('알림을 받습니다.');
      await firebase
        .database()
        .ref('FcmNotiPush')
        .update({
          [id]: true,
        });
    } else {
      this.refs.toast.show('알림을 받지않습니다.');
      await firebase
        .database()
        .ref('FcmNotiPush')
        .update({
          [id]: false,
        });
    }
    this.setState({
      alarm: val,
    });
  };

  async componentDidMount() {
    var id = await AsyncStorage.getItem('@USER_ID');
    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      // 화면에 들어와있을 때 알림
      this.removeToastListener = Firebase.notifications().onNotification(
        notification => {
          if (
            notification.android._notification._data.msg !== CHAT_ROOM_IN &&
            notification.android._notification._data.msg !== ROOM_OUT
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                ' : ' +
                notification.android._notification._data.msg,
            );
          } else if (
            notification.android._notification._data.msg === ROOM_OUT
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                '님이 채팅방을 나갔습니다.',
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
    let alarmValue;
    let error;
    try {
      console.log('GET OS VERSION : ' + Platform.Version.toString());
      await firebase
        .database()
        .ref('FcmNotiPush/' + id)
        .once('value', data => {
          alarmValue = JSON.stringify(data);
          if (alarmValue === 'false') {
            alarmValue = false;
          } else {
            alarmValue = true;
          }
        });
    } catch (error) {
      console.log(error);
      error = "Cnat't get MORE API";
    } finally {
      this.setState({
        loading: false,
        id: id,
        alarm: alarmValue,
        error,
      });
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount[SettingContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
  }

  render() {
    const {loading, id, alarm} = this.state;
    return (
      <>
        <SettingPresenter
          loading={loading}
          id={id}
          alarm={alarm}
          alarmChange={this.alarmChange}
        />
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
