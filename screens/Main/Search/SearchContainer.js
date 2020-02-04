import React from 'react';
import SearchPresenter from './SearchPresenter';
import {movie, LESPO_API} from '../../../api/Api';
import Toast from 'react-native-easy-toast';
import Firebase from 'react-native-firebase';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '여행하기 검색',
    };
  };

  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: false,
      jejuResult: null,
      searchTerm: '',
      navigation,
      error: null,
    };
  }

  async componentDidMount() {
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
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        this.onSubmitEditing();
      }),
    ];
  }

  componentWillUnmount() {
    this.removeNotificationOpenedListener();
    this.subs.forEach(sub => sub.remove());
  }

  // text 입력값 받아온다
  handleSearchUpdate = text => {
    this.setState({
      searchTerm: text,
    });
    console.log(this.state.searchTerm);
  };

  // 검색한 결과값
  onSubmitEditing = async () => {
    const {searchTerm} = this.state;
    console.log(searchTerm);
    if (searchTerm !== '') {
      let loading, jejuResult, error;
      this.setState({
        loading: true,
      });
      try {
        ({
          data: {data: jejuResult},
        } = await LESPO_API.getSearchList(searchTerm));
        this.setState({
          loading: false,
          jejuResult,
          error,
        });
        console.log(JSON.stringify(jejuResult));
      } catch {
        error = "Can't Search";
      }
      return;
    }
  };

  render() {
    const {loading, jejuResult, searchTerm} = this.state;
    return (
      <>
        <SearchPresenter
          loading={loading}
          jejuResult={jejuResult}
          searchTerm={searchTerm}
          onSubmitEditing={this.onSubmitEditing}
          handleSearchUpdate={this.handleSearchUpdate}
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
