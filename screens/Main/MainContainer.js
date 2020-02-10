import React from 'react';
import MainPresenter from './MainPresenter';
import {LESPO_API} from '../../api/Api';
import Firebase from 'react-native-firebase';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';

// set DATA = Container
export default class extends React.Component {
  _isMounted = false;
  constructor(props) {
    console.log('constructor');
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      mainList: [],
      foodList: [],
      playList: [],
      viewList: [],
      navigation,
      error: null,
    };
  }

  async componentDidMount() {
    let userId = await AsyncStorage.getItem('@USER_ID');
    console.log(userId);
    const FcmToken = await Firebase.messaging().getToken();
    await AsyncStorage.setItem('@FCM', FcmToken);
    await firebase
      .database()
      .ref('FcmTokenList')
      .update({
        [userId]: FcmToken,
      })
      .then(data => {
        //success callback
        console.log(data);
        console.log('update my FcmToken: ', FcmToken);
        // AsyncStorage save
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
    const API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    await firebase
      .database()
      .ref('APITokenList')
      .update({
        [userId]: API_TOKEN,
      })
      .then(data => {
        //success callback
        console.log(data);
        console.log('update my FcmToken: ', FcmToken);
        // AsyncStorage save
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
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

    this._isMounted = true;
    this.onListChanging();
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
    try {
      await LESPO_API.getMainList()
        .then(response => {
          this.setState({
            mainList: response.data.data,
          });
        })
        .catch(error => {
          console.log('getMainList fail: ' + error);
        });
      await LESPO_API.getMainFoodList()
        .then(response => {
          this.setState({
            foodList: response.data.data,
          });
        })
        .catch(error => {
          console.log('getFoodList fail: ' + error);
        });
      await LESPO_API.getMainPlayList()
        .then(response => {
          this.setState({
            playList: response.data.data,
          });
        })
        .catch(error => {
          console.log('getPlayList fail: ' + error);
        });
      await LESPO_API.getMainViewList()
        .then(response => {
          this.setState({
            viewList: response.data.data,
          });
          if (this._isMounted) {
            console.log('on');
            this.setState({
              loading: false,
            });
          } else {
            console.log('off');
          }
        })
        .catch(error => {
          console.log('getViewList fail: ' + error);
        });
    } catch (error) {
      console.log("Cant't get MainList. : " + error);
    }
  };

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this._isMounted = false;
    this.subs.forEach(sub => sub.remove());
    this.removeNotificationOpenedListener();
    firebase
      .database()
      .ref('FcmTokenList')
      .off();
  }

  render() {
    const {loading, mainList, foodList, playList, viewList} = this.state;
    return (
      <>
        <MainPresenter
          loading={loading}
          mainList={mainList}
          foodList={foodList}
          playList={playList}
          viewList={viewList}
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
