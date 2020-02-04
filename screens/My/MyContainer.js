import React from 'react';
import {Modal} from 'react-native';
import SimpleDialog from '../../components/SimpleDialog';
import MyPresenter from './MyPresenter';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions} from 'react-navigation';
import Firebase, {config} from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {LESPO_API} from '../../api/Api';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: false,
      isModalVisible: false,
      loginStatus: '',
      name: '',
      profile: '',
      rating: '',
      coin: '',
      navigation: navigation,
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
    let roomKey = await AsyncStorage.getItem('@NOTI_ROOMKEY');
    let id = await AsyncStorage.getItem('@NOTI_ID');
    let name = await AsyncStorage.getItem('@NOTI_NAME');
    let profile = await AsyncStorage.getItem('@NOTI_PROFILE');
    console.log('내정보 => roomKeyCheck : ' + roomKey);
    if (roomKey === '' || roomKey === null) {
      console.log('not noti click');
    } else {
      console.log('noti click');
      this.state.navigation.navigate({
        routeName: 'MyBattleTalk',
        params: {
          roomKey,
          id,
          name,
          profile,
        },
      });
    }
    this.getData();
  }

  // 내정보 저장값 불러오기
  getData = async () => {
    console.log('getData');
    try {
      let API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
      let M_NAME = await AsyncStorage.getItem('@USER_NAME');
      let M_PROFILE = await AsyncStorage.getItem('@USER_PROFILE');
      const config = {
        headers: {
          Authorization: API_TOKEN,
        },
      };
      await LESPO_API.getRating(config)
        .then(response => {
          this.setState({
            rating: response.data.data.rating,
          });
        })
        .catch(error => {
          console.log('getRating fail: ' + error);
        });
      await LESPO_API.getCoin(config)
        .then(response => {
          this.setState({
            coin: response.data.data.credit,
          });
        })
        .catch(error => {
          console.log('getCoin fail: ' + error);
        });
      this.setState({
        name: M_NAME,
        profile: M_PROFILE,
      });
      if (M_PROFILE !== null || M_PROFILE !== '') {
        console.log('프로필 있다.');
      } else {
        console.log('프로필 없다.');
      }
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  //TODO: Logout
  setData = data => {
    console.log('setData::: ', data);
    if (data === 'OK') {
      this.props.navigation.navigate({routeName: 'Login'});
      // const resetAction = NavigationActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({routeName: 'Login'})],
      // });
      // this.props.navigation.dispatch(resetAction);
      // this.props.navigation.dispatch(
      //   NavigationActions.reset({
      //     index: 0,
      //     actions: [NavigationActions.navigate({routeName: 'Login'})],
      //   }),
      // );
    }
  };

  componentWillUnmount() {
    this.removeNotificationOpenedListener();
  }

  render() {
    const {loading, name, profile, rating, coin} = this.state;
    return (
      <>
        <MyPresenter
          loading={loading}
          name={name}
          profile={profile}
          rating={rating}
          coin={coin}
          changeModalVisiblity={this.changeModalVisiblity}
          setData={this.setData}
        />
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            battleState={null}
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
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
