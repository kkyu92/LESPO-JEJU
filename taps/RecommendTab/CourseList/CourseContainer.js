import React, {useEffect} from 'react';
import {request, PERMISSIONS} from 'react-native-permissions';
import CoursePresenter from './CoursePresenter';
import Geolocation from 'react-native-geolocation-service';
import {tv, movie, LESPO_API} from '../../../api/Api';
import {View, Text, Platform} from 'react-native';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {CHAT_ROOM_IN} from '../../../constants/Strings';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      clickID: null,
      latitude: null,
      longitude: null,
      listChanged: null,
      locations: null,
      navigation,
      error: null,
    };
  }

  // 사용자 위치
  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('Course iPhone : ', response);
      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Course Android : ', response);
      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    }
  };

  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        try {
          const {latitude, longitude} = position.coords;
          this.setState({
            latitude: latitude,
            longitude: longitude,
          });
        } catch (error) {
          console.log(error);
        } finally {
          console.log('Course: ', this.state.latitude, this.state.longitude);
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

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
    let listChanged = [];
    let locations = [];
    let error;
    try {
      ({
        data: {data: listChanged},
      } = await LESPO_API.getRecommends());
      console.log('Success: ' + JSON.stringify(listChanged));
      listChanged.forEach(child => {
        let num = child.id;
        child.detail.marker_address.forEach(child => {
          locations.push({
            id: num,
            key: child.id,
            location: {
              latitude: window.parseFloat(child.lat),
              longitude: window.parseFloat(child.lng),
            },
            title: child.title,
            address: child.address,
          });
        });
      });
      console.log('Success!! : ' + JSON.stringify(locations));
    } catch (error) {
      console.log(error);
      error = "Cnat't get Course";
    } finally {
      this.setState({
        loading: false,
        clickID: locations[0].id,
        listChanged: listChanged,
        locations: locations,
        error,
      });
      this.requestLocationPermission();
    }
  }

  markerOn = async id => {
    const {locations} = this.state;
    console.log('marker ON !');
    console.log(id);
    this.setState({
      clickID: id,
    });
  };
  componentWillUnmount() {
    console.log('componentWillUnmount[Tap]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
  }
  render() {
    const {
      loading,
      latitude,
      longitude,
      listChanged,
      locations,
      clickID,
    } = this.state;
    // 위치정보 받기 전
    if (latitude) {
      return (
        <>
          <CoursePresenter
            loading={loading}
            listChanged={listChanged}
            locations={locations}
            latitude={latitude}
            longitude={longitude}
            markerOn={this.markerOn}
            clickID={clickID}
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
            <Text>위치권한 정보를 확인해주세요....</Text>
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
