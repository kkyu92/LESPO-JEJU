import React from 'react';
import MainPresenter from './MainPresenter';
import {LESPO_API} from '../../api/Api';
import Firebase from 'react-native-firebase';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-easy-toast';
import {BG_COLOR, TINT_COLOR} from '../../constants/Colors';

// set DATA = Container
export default class extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mainList: [],
      foodList: [],
      playList: [],
      viewList: [],
      error: null,
    };
    console.log('constructor');
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
        console.log('update my FcmToken: ', JSON.stringify(data));
        // AsyncStorage save
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      // 화면에 들어와있을 때
      Firebase.notifications().onNotification(notification => {
        // alert('notification._android');
        console.log(
          'get FCM msg : ' + notification.android._notification._data,
        );
        this.refs.toast.show(
          notification.android._notification._data.sender +
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
    // this.setState({
    //   loading: true,
    // });
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
  }

  componentWillUnmount() {
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
          style={{backgroundColor: BG_COLOR}}
          position="top"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{color: TINT_COLOR}}
        />
      </>
    );
  }
}
