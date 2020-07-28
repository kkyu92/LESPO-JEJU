import React from 'react';
import {Text, View, Linking} from 'react-native';
import styled from 'styled-components';
import {LESPO_API} from '../../../api/Api';
import JejuSoundPresenter from './JejuSoundPresenter';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {CHAT_ROOM_IN, ROOM_OUT} from '../../../constants/Strings';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '이벤트',
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
      this.removeToastListener = () => {};
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
    let listChanged = [];
    let error;
    try {
      ({
        data: {data: listChanged},
      } = await LESPO_API.getJejuSound());
      // console.log('Reco Food List : ' + JSON.stringify(listChanged));
    } catch (error) {
      console.log('JejuSound get api ::: ' + error);
      error = "Cant't get Event.";
    } finally {
      this.setState({
        loading: false,
        listChanged,
        error,
      });
    }
  }

  //친구 추가 하기로 링크
  addFriend = async () => {
    Linking.openURL('https://pf.kakao.com/_fxdMxlxb');
    // console.log('구매문의');
    // const add = await RNKakaoPlusFriend.addFriend('_fxdMxlxb');
    // console.log(add);
  };

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
          } = await LESPO_API.getJejuSound());
          listChanged.sort(function(a, b) {
            return new Date(b.created_at) - new Date(a.created_at);
          });
        } else if (listName === 'likes') {
          ({
            data: {data: listChanged},
          } = await LESPO_API.getJejuSound());
          listChanged.sort(function(a, b) {
            return b.like_count - a.like_count;
          });
        } else if (listName === 'nearest') {
          ({
            data: {data: listChanged},
          } = await LESPO_API.getJejuSound());
        } else {
          ({
            data: {data: listChanged},
          } = await LESPO_API.getJejuSound());
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

  componentWillUnmount() {
    console.log('componentWillUnmount[EventContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
  }

  render() {
    const {loading, listName, listChanged} = this.state;
    if (listChanged) {
      return (
        <>
          <JejuSoundPresenter
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
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>위치정보를 불러오는중입니다....</Text>
        </View>
      );
    }
  }
}
