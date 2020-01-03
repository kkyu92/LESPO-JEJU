import React, {useEffect} from 'react';
import {request, PERMISSIONS} from 'react-native-permissions';
import MapPresenter from './MapPresenter';
import Geolocation from 'react-native-geolocation-service';
import {View, Text, Platform} from 'react-native';

export default class extends React.Component {
  state = {
    loading: true,
    latitude: null,
    longitude: null,
    listChanged: null,
    error: null,
  };
  static navigationOptions = () => {
    // return {
    //   title: navigation.getParam("title")
    // };
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          //   params: { id, backgroundPoster, title, avg, overview }
          params: {listChanged},
        },
      },
    } = props;
    this.state.listChanged = listChanged;
    this.state.loading = false;
  }

  // 사용자 위치
  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('MapView iPhone : ', response);
      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('MapView Android : ', response);
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
          console.log('MapView: ', this.state.latitude, this.state.longitude);
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
    this.requestLocationPermission();
  }
  render() {
    const {loading, latitude, longitude, listChanged} = this.state;
    // 위치정보 받기 전
    if (latitude) {
      return (
        <MapPresenter
          loading={loading}
          latitude={latitude}
          longitude={longitude}
          listChanged={listChanged}
        />
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
