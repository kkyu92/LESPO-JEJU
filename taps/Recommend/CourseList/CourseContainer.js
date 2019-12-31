import React from 'react';
import {request, PERMISSIONS} from 'react-native-permissions';
import CoursePresenter from './CoursePresenter';
import Geolocation from '@react-native-community/geolocation';
import {tv, movie} from '../../../api/Api';
import {Platform, Alert} from 'react-native';

export default class extends React.Component {
  state = {
    loading: true,
    latitude: null,
    longitude: null,
    listChanged: null,
    error: null,
  };

  // 사용자 위치
  async requestLocationPermission() {
    if (Platform.OS === 'ios') {
      var request = await Request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('iPhone : ' + response);
      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var request = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Android : ' + response);
      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    }
  }

  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(JSON.stringify(position));
        // let initialPosition = {
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        //   latitudeDelta: 0.09,
        //   longitudeDelta: 0.035,
        // };
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(this.state.latitude, this.state.longitude);
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  };

  // 시작시 불러옴
  async componentDidMount() {
    this.locateCurrentPosition();
    let listChanged, error;
    try {
      ({
        data: {results: listChanged},
      } = await movie.getSearchMovie('king'));
    } catch (error) {
      console.log(error);
      error = "Cnat't get Course";
    } finally {
      this.setState({
        loading: false,
        listChanged,
        error,
      });
    }
  }
  render() {
    const {loading, latitude, longitude, listChanged} = this.state;
    // 위치정보 받기 전
    if (loading) {
      return (
        <CoursePresenter
          loading={loading}
          listChanged={listChanged}
          latitude={latitude}
          longitude={longitude}
        />
      );
    }
    return (
      <CoursePresenter
        loading={loading}
        listChanged={listChanged}
        latitude={latitude}
        longitude={longitude}
      />
      // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      //   <Text>위치정보를 불러오는중입니다....</Text>
      // </View>
    );
  }
}
