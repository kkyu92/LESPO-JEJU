import React from 'react';
import Text from 'react-native';
import styled from 'styled-components';
import {tv, movie, LESPO_API} from '../../../api/Api';
import JejuGiftPresenter from './JejuGiftPresenter';
import Firebase from 'react-native-firebase';
import RNKakaoPlusFriend from 'react-native-kakao-plus-friend';
import Toast from 'react-native-easy-toast';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '쇼핑',
    };
  };
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      listName: null,
      listChanged: null,
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
          if (
            notification.android._notification._data.msg !==
            '~!@채팅방들어와서확인함~!@'
          ) {
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
    let listChanged, error;
    try {
      ({
        data: {data: listChanged},
      } = await LESPO_API.getJejuAd());
    } catch (error) {
      console.log(error);
      error = "Cnat't get Shopping";
    } finally {
      this.setState({
        loading: false,
        listChanged,
        error,
      });
    }
    // 화면 돌아왔을 때 reload !
    // this.subs = [
    //   this.props.navigation.addListener('willFocus', () => {
    //     console.log('willFocus ::: reload');
    //     this.onListChanging();
    //   }),
    // ];
  }

  //친구 추가 하기로 링크
  addFriend = async () => {
    console.log('구매문의');
    const add = await RNKakaoPlusFriend.addFriend('_fxdMxlxb');
    console.log(add);
  };
  //바로 채팅하기로 링크
  chat = async () => {
    await RNKakaoPlusFriend.chat('_fxdMxlxb');
  };

  componentWillUnmount() {
    console.log('componentWillUnmount[ShopContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
  }

  // List 입력값 받아온다
  handleListUpdate = list => {
    this.setState({
      listName: list,
    });
    console.log('getListName ::: ' + list);
    if (Platform.OS === 'android') {
      console.log('go Android ::: ' + list);
      this.state.listName = list;
      this.onListChanging();
    }
  };

  // 검색한 결과값
  onListChanging = async () => {
    const {listName} = this.state;
    if (listName !== '') {
      console.log('listChanging ::: ' + listName);
      let listChanged, error;
      this.setState({
        loading: true,
      });
      try {
        if (listName === 'latest') {
          ({
            data: {data: listChanged},
          } = await LESPO_API.getJejuAd());
          listChanged.sort(function(a, b) {
            return new Date(b.created_at) - new Date(a.created_at);
          });
        } else if (listName === 'likes') {
          ({
            data: {data: listChanged},
          } = await LESPO_API.getJejuAd());
          listChanged.sort(function(a, b) {
            return b.like_count - a.like_count;
          });
        } else if (listName === 'nearest') {
          ({
            data: {data: listChanged},
          } = await LESPO_API.getJejuAd());
        } else {
          ({
            data: {data: listChanged},
          } = await LESPO_API.getJejuAd());
          listChanged.sort(function(a, b) {
            return new Date(b.created_at) - new Date(a.created_at);
          });
        }
      } catch {
        error = "Can't Search";
      } finally {
        this.setState({
          loading: false,
          listChanged,
          listName,
          error,
        });
      }
      return;
    }
  };

  render() {
    const {loading, listName, listChanged} = this.state;
    return (
      <>
        <JejuGiftPresenter
          loading={loading}
          listName={listName}
          listChanged={listChanged}
          onListChanging={this.onListChanging}
          handleListUpdate={this.handleListUpdate}
          addFriend={this.addFriend}
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
