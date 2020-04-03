import React from 'react';
import {Modal, Platform} from 'react-native';
import SimpleDialog from '../../components/SimpleDialog';
import MyPresenter from './MyPresenter';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import Firebase, {config} from 'react-native-firebase';
import firebase from 'firebase';
import Toast from 'react-native-easy-toast';
import {LESPO_API} from '../../api/Api';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  ProductPurchase,
  PurchaseError,
} from 'react-native-iap';
import {CHAT_ROOM_IN} from '../../constants/Strings';

const itemSkus = Platform.select({
  ios: ['battleCoin'],
  android: ['battlecoin', 'battlecoin1'],
  // android: ['com.lespojeju'],
});
let countCoin = 0;
export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      isModalVisible: false,
      loginStatus: '',
      provider: '',
      name: '',
      profile: '',
      rating: '',
      coin: '',
      modal: null,
      products: [],
      navigation: navigation,
    };
  }

  requestPurchase = async () => {
    countCoin = 0;
    console.log('requestPurchase : ' + this.state.products[0].productId);
    try {
      await RNIap.requestPurchase(this.state.products[0].productId, false);
    } catch (err) {
      if (err.code == 'E_USER_CANCELLED') {
        this.refs.toast.show('코인 충전을 취소하였습니다.');
      } else {
        console.warn(err.code, err.message);
      }
    }
  };

  insertCoin = async () => {
    console.log('insertCoin');
    let API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const params = new URLSearchParams();
    params.append('credit', 1);
    const config = {
      headers: {
        Authorization: API_TOKEN,
      },
    };
    await LESPO_API.insertCoin(params, config);
    // insert Coin
    try {
      this.refs.toast.show('코인 1개를 충전했습니다.');
      await LESPO_API.getCoin(config)
        .then(response => {
          this.setState({
            coin: response.data.data.credit,
          });
        })
        .catch(error => {
          console.log('getCoin fail: ' + error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidMount() {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      (purchase = ProductPurchase) => {
        RNIap.finishTransaction(purchase, true);
        console.log(countCoin);
        const receipt = purchase.transactionReceipt;
        try {
          if (countCoin === 0) {
            this.insertCoin();
            countCoin++;
            if (Platform.OS === 'ios') {
              console.log(
                'receipt: ',
                purchase.productId,
                purchase.transactionDate,
                purchase.transactionId,
              );
            } else if (Platform.OS === 'android') {
              console.log('receipt: ', receipt);
            }
          }
        } catch (error) {
          console.log(error);
        }
        // if (Platform.OS === 'ios') {
        //     // RNIap.finishTransactionIOS(purchase.transactionId);
        //   console.log(
        //     'receipt: ',
        //     purchase.productId,
        //     purchase.transactionDate,
        //     purchase.transactionId,
        //   );
        // } else if (Platform.OS === 'android') {
        //   console.log('receipt: ', receipt);
        //   //   RNIap.consumePurchaseAndroid(purchase.purchaseToken);
        //   //   console.log('purchaseToken: ', purchase.purchaseToken);
        // }
        // RNIap.finishTransaction(purchase, true);
        // this.insertCoin();
      },
    );

    try {
      let provider = await AsyncStorage.getItem('@USER_PROVIDER');
      const products = await RNIap.getProducts(itemSkus);
      this.setState({products: products, provider});
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }

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
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        console.log('willFocus ::: reload');
        this.getData();
      }),
    ];
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
      console.log(M_NAME + '\n' + API_TOKEN);
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
        loading: false,
        name: M_NAME,
        profile: M_PROFILE,
      });
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

  changeModalVisiblity = modal => {
    if (modal === false) {
      this.setState({
        isModalVisible: false,
      });
    } else {
      this.setState({
        isModalVisible: true,
        modal: modal,
      });
    }
  };

  //TODO: Logout
  setData = async (data, changePassword) => {
    console.log('setData::: ', data);
    console.log('modal: ' + this.state.modal);
    let ID = await AsyncStorage.getItem('@USER_ID');
    let API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: API_TOKEN,
      },
    };
    if (data === 'OK') {
      if (this.state.modal === '회원탈퇴') {
        LESPO_API.userDelete(config);
        await firebase
          .database()
          .ref('FcmTokenList/' + ID)
          .remove()
          .then(data => {
            console.log('delete FCM Token');
          })
          .catch(error => {
            console.log('error ', error);
          });
        await firebase
          .database()
          .ref('APITokenList/' + ID)
          .remove()
          .then(data => {
            console.log('delete API Token');
          })
          .catch(error => {
            console.log('error ', error);
          });
      }
      await AsyncStorage.setItem('@AUTO_LOGIN', 'false');
      await AsyncStorage.setItem('@USER_EMAIL', '');
      await AsyncStorage.setItem('@USER_PASSWORD', '');
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Login'})],
      });
      this.props.navigation.dispatch(resetAction);
    } else if (data === 'CHANGE') {
      this.refs.toast.show('비밀번호가 변경되었습니다.');
      const params = new URLSearchParams();
      params.append('password', changePassword);
      LESPO_API.changePassword(params, config);
    }
  };

  componentWillUnmount() {
    console.log('componentWillUnmount[MyContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    this.subs.forEach(sub => sub.remove());
  }

  render() {
    const {
      loading,
      provider,
      name,
      profile,
      rating,
      coin,
      modal,
      isModalVisible,
    } = this.state;
    return (
      <>
        <MyPresenter
          loading={loading}
          provider={provider}
          name={name}
          profile={profile}
          rating={rating}
          coin={coin}
          changeModalVisiblity={this.changeModalVisiblity}
          requestPurchase={this.requestPurchase}
        />
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            battleState={modal}
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
        <Toast
          ref="toast"
          style={{backgroundColor: '#fee6d0'}}
          position="bottom"
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
