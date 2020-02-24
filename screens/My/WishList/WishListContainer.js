import React from 'react';
import WishListPresenter from './WishListPresenter';
import {tv, movie, LESPO_API} from '../../../api/Api';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {CHAT_ROOM_IN} from '../../../constants/Strings';

export default class extends React.Component {
  static navigationOptions = () => {
    return {
      title: '위시리스트',
    };
  };
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
    // 화면 돌아왔을 때 reload !
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        console.log('willFocus ::: reload');
        this.onListChanging();
      }),
    ];
  }

  onListChanging = async () => {
    this.setState({
      loading: true,
    });
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

  // 나갔을때
  componentWillUnmount() {
    console.log('componentWillUnmount[WishListContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    this.subs.forEach(sub => sub.remove());
  }

  render() {
    const {loading, listChanged, locations} = this.state;
    return (
      <>
        <WishListPresenter
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
  }
}
