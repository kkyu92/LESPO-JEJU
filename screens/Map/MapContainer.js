import React, {useEffect} from 'react';
import {request, PERMISSIONS} from 'react-native-permissions';
import MapPresenter from './MapPresenter';
import Geolocation from 'react-native-geolocation-service';
import {View, Text, Platform} from 'react-native';
import {LESPO_API} from '../../api/Api';

export default class extends React.Component {
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
          params: {listChanged, locations, mainState},
        },
      },
    } = props;
    this.state = {
      loading: true,
      latitude: null,
      longitude: null,
      listChanged,
      locations,
      mainState,
      listName: '',
      error: null,
    };
    // console.log('locations ========= ' + JSON.stringify(locations));
    // console.log(
    //   'locations.locations ========= ' + JSON.stringify(locations.locations),
    // );
    // this.state.listChanged = listChanged;
    // this.state.loading = false;
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
    let {mainState, listChanged, locations} = this.state;
    this.requestLocationPermission();
    if (mainState === 'map') {
      // map = Main Map Btn
      try {
        console.log('mainState: ' + mainState);
        await LESPO_API.getFoodList()
          .then(response => {
            listChanged = response.data.data;
            locations = {
              mark: [],
              locations: [],
            };
            let count = 0;
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
            this.setState({
              listChanged: listChanged,
              locations: locations,
            });
            console.log(JSON.stringify(this.state.locations));
          })
          .catch(error => {
            console.log('getFoodList fail: ' + error);
          });
      } catch (error) {
        console.log("Cant't get mapList marker. : " + error);
      } finally {
        console.log('finally');
        this.setState({
          loading: false,
        });
      }
    } else if (mainState === 'wish') {
      // wish = Main Wish Btn
    } else {
      console.log('mainState: null');
      try {
        this.setState({
          loading: false,
        });
      } catch (error) {}
      console.log(this.state.loading);
    }
  }

  onListChanging = async listName => {
    let {listChanged, locations} = this.state;
    console.log('listChanging ::: ' + listName);
    this.setState({
      loading: true,
    });
    try {
      if (listName === 'view') {
        await LESPO_API.getViewList()
          .then(response => {
            listChanged = response.data.data;
            locations = {
              mark: [],
              locations: [],
            };
            let count = 0;
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
            this.setState({
              listChanged: listChanged,
              locations: locations,
            });
          })
          .catch(error => {
            console.log('getViewList fail: ' + error);
          });
      } else if (listName === 'play') {
        await LESPO_API.getPlayList()
          .then(response => {
            listChanged = response.data.data;
            locations = {
              mark: [],
              locations: [],
            };
            let count = 0;
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
            this.setState({
              listChanged: listChanged,
              locations: locations,
            });
          })
          .catch(error => {
            console.log('getPlayList fail: ' + error);
          });
      } else {
        await LESPO_API.getFoodList()
          .then(response => {
            listChanged = response.data.data;
            locations = {
              mark: [],
              locations: [],
            };
            let count = 0;
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
            this.setState({
              listChanged: listChanged,
              locations: locations,
            });
            // console.log(JSON.stringify(this.state.locations));
          })
          .catch(error => {
            console.log('getFoodList fail: ' + error);
          });
      }
    } catch (error) {
      console.log('changeList error : ' + error);
    } finally {
      this.setState({
        loading: false,
        listChanged,
        locations,
        listName,
      });
    }
    // return;
  };

  render() {
    const {
      loading,
      latitude,
      longitude,
      listChanged,
      locations,
      mainState,
      listName,
    } = this.state;
    // 위치정보 받기 전
    if (latitude) {
      return (
        <MapPresenter
          loading={loading}
          latitude={latitude}
          longitude={longitude}
          listChanged={listChanged}
          locations={locations}
          mainState={mainState}
          listName={listName}
          onListChanging={this.onListChanging}
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
