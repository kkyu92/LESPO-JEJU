import React from 'react';
import SettingPresenter from './SettingPresenter';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      alarm: true,
      navigation,
      error: null,
    };
  }

  alarmChange = val => {
    this.setState({
      alarm: val,
    });
  };

  async componentDidMount() {
    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      // 화면에 들어와있을 때 알림
      this.removeToastListener = Firebase.notifications().onNotification(
        notification => {
          this.refs.toast.show(
            notification.android._notification._data.name +
              ' : ' +
              notification.android._notification._data.msg,
          );
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
    let error;
    try {
    } catch (error) {
      console.log(error);
      error = "Cnat't get MORE API";
    } finally {
      this.setState({
        loading: false,
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
    const {loading, alarm} = this.state;
    return (
      <>
        <SettingPresenter
          loading={loading}
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
