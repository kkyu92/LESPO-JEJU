import React from 'react';
import {NavigationActions} from 'react-navigation';
import MainPresenter from './MainPresenter';
import {LESPO_API} from '../../api/Api';
import Firebase from 'react-native-firebase';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';
import {Linking, Platform} from 'react-native';
import {CHAT_ROOM_IN, ROOM_OUT} from '../../constants/Strings';
import {ShareLink} from '../../components/Linking';

// set DATA = Container
export default class extends React.Component {
  _isMounted = false;
  constructor(props) {
    console.log('constructor');
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      detailId: '',
      mainList: [],
      foodList: [],
      playList: [],
      viewList: [],
      navigation,
      toast: null,
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
          if (
            notification.android._notification._data.msg !== CHAT_ROOM_IN &&
            notification.android._notification._data.msg !== ROOM_OUT
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                ' : ' +
                notification.android._notification._data.msg,
            );
          } else if (
            notification.android._notification._data.msg === ROOM_OUT
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                '님이 채팅방을 나갔습니다.',
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

    // 공유하기 Deep Link
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('all ev1: ' + url);
        let id = ShareLink.navigate(url);
        this.props.navigation.navigate({
          routeName: 'Detail',
          params: {
            id: id,
          },
        });
      }
    });
    Linking.addEventListener(
      'url',
      (ShareLink.handleOpenURL = async id => {
        let url = id.url;
        let deatilCheck = await AsyncStorage.getItem('@DETAIL_PAGE');
        // detail page 머물러있는경우 링킹이 안되어서 조건 걸어 체크
        if (deatilCheck === 'true') {
          this.props.navigation.goBack(null);
        }
        console.log('all ev2: ' + url);
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
      }),
    );

    this._isMounted = true;
    let noti = await AsyncStorage.getItem('@NOTI_ROOMKEY');
    if (noti) {
      console.log('noti 확인');
      this.state.navigation.navigate({routeName: '내정보'});
    } else {
      console.log('noti 아닌경우');
      this.onListChanging();
    }
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
          console.log('getMain');
          this.setState({
            mainList: response.data.data,
          });
        })
        .catch(error => {
          console.log('getMainList fail: ' + error);
        });
      await LESPO_API.getMainFoodList()
        .then(response => {
          console.log('getFood');
          this.setState({
            foodList: response.data.data,
          });
        })
        .catch(error => {
          console.log('getFoodList fail: ' + error);
        });
      await LESPO_API.getMainPlayList()
        .then(response => {
          console.log('getPlay');
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
            console.log('getView == finish');
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
    console.log('componentWillUnmount[MAIN]');
    this.removeToastListener();
    this._isMounted = false;
    this.subs.forEach(sub => sub.remove());
    this.removeNotificationOpenedListener();
    Linking.removeEventListener('url', ShareLink.handleOpenURL);
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
          ref={'toast'}
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
