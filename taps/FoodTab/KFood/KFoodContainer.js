import React from 'react';
import {Platform, View, Text} from 'react-native';
import KFoodPresenter from './KFoodPresenter';
import {tv, movie, LESPO_API} from '../../../api/Api';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {CHAT_ROOM_IN} from '../../../constants/Strings';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      listChanged: null,
      locations: null,
      navigation,
      error: null,
    };
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
    this.onListChanging();
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        this.onListChanging();
      }),
    ];
  }

  onListChanging = async () => {
    // this.setState({
    //   loading: true,
    // });
    let listChanged = [];
    let locations = {
      mark: [],
      locations: [],
    };
    let count = 0;
    let error;
    try {
      ({
        data: {data: listChanged},
      } = await LESPO_API.getFoodKorea());
      // console.log('Food Korea List : ' + JSON.stringify(listChanged));
      listChanged.forEach(child => {
        let num = child.id;
        child.detail.marker_address.forEach(child => {
          locations.locations.push({
            id: num,
            key: count,
            location: {
              latitude: window.parseFloat(child.lat),
              longitude: window.parseFloat(child.lng),
            },
            title: child.title,
            address: child.address,
          });
          count++;
        });
      });
      // console.log('Food Korea Locatoins : ' + JSON.stringify(locations));
    } catch (error) {
      console.log(error);
      error = "Cnat't get KoreaFood List";
    } finally {
      this.setState({
        loading: false,
        listChanged: listChanged,
        locations: locations,
        error,
      });
    }
  };

  componentWillUnmount() {
    console.log('componentWillUnmount[Tap]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    this.subs.forEach(sub => sub.remove());
  }

  render() {
    const {loading, listChanged, locations} = this.state;
    // 위치정보 받기 전
    if (listChanged) {
      return (
        <>
          <KFoodPresenter
            loading={loading}
            listChanged={listChanged}
            locations={locations}
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
    } else {
      return (
        <>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>정보를 불러오는중입니다....</Text>
          </View>
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
}
