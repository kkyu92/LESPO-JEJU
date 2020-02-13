import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';
import {LESPO_API} from '../../../api/Api';
import JejuSoundPresenter from './JejuSoundPresenter';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '이벤트',
    };
  };
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      listChanged: null,
      navigation,
      error: null,
    };
  }

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
    let listChanged = [];
    let error;
    try {
      ({
        data: {data: listChanged},
      } = await LESPO_API.getJejuSound());
      // console.log('Reco Food List : ' + JSON.stringify(listChanged));
    } catch (error) {
      console.log('JejuSound get api ::: ' + error);
      error = "Cant't get Movies.";
    } finally {
      this.setState({
        loading: false,
        listChanged: listChanged,
        error,
      });
    }
  }

  componentWillUnmount() {
    this.removeNotificationOpenedListener();
  }

  render() {
    const {loading, listChanged} = this.state;
    if (listChanged) {
      return (
        <>
          <JejuSoundPresenter loading={loading} listChanged={listChanged} />
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
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>위치정보를 불러오는중입니다....</Text>
        </View>
      );
    }
  }
}
