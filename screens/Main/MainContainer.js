import React from 'react';
import MainPresenter from './MainPresenter';
import {LESPO_API} from '../../api/Api';
import Firebase from 'react-native-firebase';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';
import {Linking} from 'react-native';

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
    // link
    if (Platform.OS === 'android') {
      //안드로이드는 아래와 같이 initialURL을 확인하고 navigate 합니다.
      Linking.getInitialURL().then(url => {
        if (url) this.navigate(url);
        // console.log('into the link get url: ' + url);
      });
    } else {
      //ios는 이벤트리스너를 mount/unmount 하여 url을 navigate 합니다.
      Linking.addEventListener('url', this.handleOpenURL);
    }

    this._isMounted = true;
    this.onListChanging();
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        console.log('willFocus ::: reload');
        this.onListChanging();
      }),
    ];
  }

  navigate = url => {
    console.log(url); // exampleapp://somepath?id=3
    const paths = url.split('?'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
    if (paths.length > 1) {
      //파라미터가 있다
      const params = paths[1].split('&');
      let id;
      for (let i = 0; i < params.length; i++) {
        let param = params[i].split('='); // [0]: key, [1]:value
        if (param[0] === 'id') {
          id = Number(param[1]); //id=3
        }
      }
      this.props.navigation.navigate({
        routeName: 'Detail',
        params: {
          id: id,
        },
      });
    }
  };

  handleOpenURL = event => {
    console.log(JSON.stringify(event));
    //이벤트 리스너.
    this.navigate(event.url);
  };

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
    Linking.removeEventListener('url', this.handleOpenURL);
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
