import React, {useEffect} from 'react';
import {request, PERMISSIONS} from 'react-native-permissions';
import MapPresenter from './MapPresenter';
import Geolocation from 'react-native-geolocation-service';
import {View, Text, Platform} from 'react-native';
import {LESPO_API} from '../../api/Api';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

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
          params: {listChanged, locations, mainState, onSavePlace},
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
      onSavePlace,
      listName: '',
      token: null,
      error: null,
    };
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
    try {
      let M_ID = await AsyncStorage.getItem('@USER_ID');
      let M_NAME = await AsyncStorage.getItem('@USER_NAME');
      let M_PROFILE = await AsyncStorage.getItem('@USER_PROFILE');
      let M_TOKEN = await AsyncStorage.getItem('@TOKEN');
      let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
      this.setState({
        token: TOKEN,
      });
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
    let {mainState, listChanged, locations, token} = this.state;
    const config = {
      headers: {
        Authorization: token,
      },
    };
    this.requestLocationPermission();
    if (mainState === 'map') {
      // map = Main Map Btn
      try {
        console.log('mainState: ' + mainState);
        await LESPO_API.getFoodList(config)
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
            console.log('check ====== ' + JSON.stringify(listChanged));
            // console.log('Token ====== ' + this.state.token);
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
    } else if (mainState === 'battle') {
      console.log('mainState: ' + mainState);
      this.onBattlePlaceListChanging();
      this.subs = [
        this.props.navigation.addListener('willFocus', () => {
          console.log('willFocus ::: reload');
          this.onBattlePlaceListChanging();
        }),
      ];
    } else if (mainState === 'wish') {
      // wish = Main Wish Btn
      console.log('mainState: ' + mainState);
      try {
        this.setState({
          loading: false,
        });
      } catch (error) {}
      this.subs = [
        this.props.navigation.addListener('willFocus', () => {
          console.log('willFocus ::: reload');
          this.onWishListChanging();
        }),
      ];
    } else {
      console.log('mainState: ' + mainState);
      try {
        this.setState({
          loading: false,
        });
      } catch (error) {}
      this.subs = [
        this.props.navigation.addListener('willFocus', () => {
          console.log('willFocus ::: reload');
          this.onContentsListChanging(mainState);
        }),
      ];
    }
    console.log(mainState, 3);
  }

  // BattlePlace List
  onBattlePlaceListChanging = async () => {
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    let listChanged = [];
    let locations = {
      mark: [],
      locations: [],
    };
    try {
      await LESPO_API.getBattlePlaceList(config)
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
          // console.log('check ====== ' + JSON.stringify(listChanged));
        })
        .catch(error => {
          console.log('get BattlePlaceList fail: ' + error);
        });
    } catch (error) {
      console.log("Cant't get Battle place marker. : " + error);
    } finally {
      console.log('finally');
      this.setState({
        loading: false,
      });
    }
  };

  // Contents List
  onContentsListChanging = async num => {
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
      if (num === 9) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getRecoFood());
      } else if (num === 10) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getRecoView());
      } else if (num === 11) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getRecoPlay());
      } else if (num === 12) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getFoodKorea());
      } else if (num === 13) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getFoodChina());
      } else if (num === 14) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getFoodAmerica());
      } else if (num === 15) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getFoodJapan());
      } else if (num === 16) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getFoodJeju());
      } else if (num === 17) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getFoodOther());
      } else if (num === 18) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getViewFamous());
      } else if (num === 19) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getViewTour());
      } else if (num === 20) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getViewSea());
      } else if (num === 21) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getViewOlleGill());
      } else if (num === 22) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getViewMountain());
      } else if (num === 23) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getViewOther());
      } else if (num === 26) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getLeisureExtreme());
      } else if (num === 27) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getLeisureWaterPark());
      } else if (num === 28) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getLeisureThemePark());
      } else if (num === 29) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getLeisureFishing());
      } else if (num === 30) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getLeisureExperience());
      } else if (num === 32) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getLeisureCamping());
      } else if (num === 33) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getLeisureOther());
      } else if (num === 34) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getSportsBall());
      } else if (num === 35) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getSportsBilliards());
      } else if (num === 36) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getSportsBowling());
      } else if (num === 37) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getSportsHealth());
      } else if (num === 38) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getSportsYoga());
      } else if (num === 39) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getSportsFight());
      } else if (num === 40) {
        ({
          data: {data: listChanged},
        } = await LESPO_API.getSportsOther());
      }

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
        loading: false,
        listChanged: listChanged,
        locations: locations,
        error,
      });
    } catch (error) {
      console.log(error);
      error = "Cnat't get Contents List Update";
    }
  };

  // WishList
  onWishListChanging = async () => {
    // this.setState({
    //   loading: true,
    // });
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    let allList = [];
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
      } = await LESPO_API.getReco(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      ({
        data: {data: listChanged},
      } = await LESPO_API.getFoodList(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      ({
        data: {data: listChanged},
      } = await LESPO_API.getViewList(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      ({
        data: {data: listChanged},
      } = await LESPO_API.getPlayList(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      ({
        data: {data: listChanged},
      } = await LESPO_API.getSportsList(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      // latest sorting
      allList = allList.sort(function(a, b) {
        return (
          new Date(moment(b.wishlist_id.updated_at).format()) -
          new Date(moment(a.wishlist_id.updated_at).format())
        );
      });

      // markers push all
      allList.forEach(child => {
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
      // console.log('wish List : ' + JSON.stringify(allList));
      // console.log('wish List Locatoins : ' + JSON.stringify(locations));
    } catch (error) {
      console.log(error);
      error = "Cnat't get WishList";
    } finally {
      this.setState({
        loading: false,
        listChanged: allList,
        locations: locations,
        error,
      });
    }
  };

  // Main map btn
  onListChanging = async listName => {
    let {listChanged, locations, token} = this.state;
    const config = {
      headers: {
        Authorization: token,
      },
    };
    console.log('listChanging ::: ' + listName);
    try {
      if (listName === 'view') {
        await LESPO_API.getViewList(config)
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
        await LESPO_API.getPlayList(config)
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
        await LESPO_API.getFoodList(config)
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

  componentWillUnmount() {
    console.log('componentWillUnmount ::: ');
    if (this.state.mainState !== 'map') {
      this.subs.forEach(sub => sub.remove());
    }
  }

  render() {
    const {
      loading,
      latitude,
      longitude,
      listChanged,
      locations,
      mainState,
      onSavePlace,
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
          onSavePlace={onSavePlace}
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
