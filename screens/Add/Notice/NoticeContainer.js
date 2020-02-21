import React from 'react';
import {tv, LESPO_API} from '../../../api/Api';
import NoticePresenter from './NoticePresenter';
import Firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '공지사항',
    };
  };
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      noticeList: null,
      index: null,
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
    let noticeList, error;

    try {
      ({
        data: {data: noticeList},
      } = await LESPO_API.getNotice());
      console.log('Success: ' + noticeList);
    } catch (error) {
      console.log('Notice get api ::: ' + error);
      error = "Cant't get Notice.";
    } finally {
      this.setState({
        loading: false,
        index: 0,
        error,
        noticeList,
      });
    }
  }
  componentWillUnmount() {
    console.log('componentWillUnmount[NoticeContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
  }

  // List 입력값 받아온다
  handleClickIndex = index => {
    if (this.state.index === index) {
      this.setState({
        index: 0,
      });
    } else {
      this.setState({
        index: index,
      });
    }
    console.log('getIndex ::: ' + index);
  };

  render() {
    const {loading, noticeList, index} = this.state;
    return (
      <>
        <NoticePresenter
          loading={loading}
          noticeList={noticeList}
          index={index}
          handleClickIndex={this.handleClickIndex}
        />
        <Toast
          ref="toast"
          style={{backgroundColor: '#fee6d0'}}
          position="top"
          positionValue={50}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{color: '#000000'}}
        />
      </>
    );
  }
}
