import React from 'react';
import 'react-native-gesture-handler';
import SettingPresenter from './SettingPresenter';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {CHAT_ROOM_IN, ROOM_OUT} from '../../../constants/Strings';
import {Platform, Linking, Alert, AppState} from 'react-native';
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
      permissionCheck: false,
      navigation,
      error: null,
      appState: AppState.currentState,
    };
  }

  alarmChange = async (val, id) => {
    console.log(val);
    this.setState({
      loading: true,
    });
    if (val) {
      const enable = await Firebase.messaging().hasPermission();
      if (!enable) {
        Alert.alert(
          '알림권한 설정',
          '앱의 알림권한이 차단되어 있어 상대방의 메시지나 배틀알림을 받을 수 없습니다.\n앱 설정에서 알림을 허용해주세요.',
          [
            {
              text: '취소',
              onPress: () => (
                this._noPermission(!val, id), console.log(this.state.alarm)
              ),
            },
            {
              text: '허용하기',
              onPress: () => (
                this._onPermission(val, id, enable),
                console.log(this.state.alarm)
              ),
            },
          ],
        );
      } else {
        this._onPermission(val, id, enable);
      }
    } else {
      this._noPermission(val, id);
    }
  };

  _onPermission = async (val, id, enable) => {
    this.refs.toast.show('알림을 받습니다.');
    await firebase
      .database()
      .ref('FcmNotiPush')
      .update({
        [id]: true,
      });
    this.setState({
      alarm: val,
      loading: false,
    });
    if (!enable) {
      this.setState({
        permissionCheck: true,
      });
      Linking.openSettings();
    }
  };

  _noPermission = async (val, id) => {
    this.refs.toast.show('알림을 받지않습니다.');
    await firebase
      .database()
      .ref('FcmNotiPush')
      .update({
        [id]: false,
      });
    this.setState({
      alarm: val,
      loading: false,
    });
  };

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    console.log(this.state.appState);
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
      this.removeToastListener = () => {};
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
          if (enable) {
            alarmValue = true;
          } else {
            alarmValue = false;
          }
        });
    } catch (error) {
      error = "Cnat't get MORE API";
      alert(error);
    } finally {
      this.setState({
        loading: false,
        id: id,
        alarm: alarmValue,
        error,
      });
      await firebase
        .database()
        .ref('FcmNotiPush')
        .update({
          [id]: alarmValue,
        });
    }
  }

  // appState
  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      this.state.permissionCheck === true
    ) {
      const enable = await Firebase.messaging().hasPermission();
      if (enable) {
        console.log('알람 허용하고 돌아옴');
        this._onPermission(true, this.state.id, enable);
      } else {
        console.log('알람 허용 안하고 돌아옴');
        this._noPermission(false, this.state.id);
      }
      this.setState({permissionCheck: false});
    }
    this.setState({appState: nextAppState});
  };

  componentWillUnmount() {
    console.log('componentWillUnmount[SettingContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    const {loading, id, alarm, navigation} = this.state;
    return (
      <>
        <SettingPresenter
          loading={loading}
          id={id}
          alarm={alarm}
          navigation={navigation}
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
