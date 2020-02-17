import React from 'react';
import {Modal, Platform} from 'react-native';
import SimpleDialog from '../../components/SimpleDialog';
import MyPresenter from './MyPresenter';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import Firebase, {config} from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {LESPO_API} from '../../api/Api';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  ProductPurchase,
  PurchaseError,
} from 'react-native-iap';

const itemSkus = Platform.select({
  ios: ['battleCoin', 'battleCoin10'],
  android: ['battlecoin', 'battlecoin1'],
  // android: ['com.lespojeju'],
});

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
      modal: null,
      products: [],
      navigation: navigation,
    };
  }

  requestPurchase = async () => {
    console.log('requestPurchase : ' + this.state.products[0].productId);
    try {
      await RNIap.requestPurchase(this.state.products[0].productId, false);
    } catch (err) {
      console.warn(err.code, err.message);
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
        const receipt = purchase.transactionReceipt;
        if (Platform.OS === 'ios') {
          //   RNIap.finishTransactionIOS(purchase.transactionId);
          console.log(
            'receipt: ',
            purchase.productId,
            purchase.transactionDate,
            purchase.transactionId,
          );
        } else if (Platform.OS === 'android') {
          console.log('receipt: ', receipt);
          //   RNIap.consumePurchaseAndroid(purchase.purchaseToken);
          //   console.log('purchaseToken: ', purchase.purchaseToken);
        }
        RNIap.finishTransaction(purchase, true);
        this.insertCoin();
      },
    );

    try {
      const products = await RNIap.getProducts(itemSkus);
      console.log('getProducts: ' + JSON.stringify(products));
      this.setState({products: products});
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }

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
        console.log('프로필 있다: ' + M_PROFILE);
      } else {
        console.log('프로필 없다.');
      }
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
  setData = async data => {
    console.log('setData::: ', data);
    console.log('modal: ' + this.state.modal);
    let API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: API_TOKEN,
      },
    };
    if (data === 'OK') {
      if (this.state.modal === '회원탈퇴') {
        LESPO_API.userDelete(config);
      }
      await AsyncStorage.setItem('@AUTO_LOGIN', 'false');
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Login'})],
      });
      this.props.navigation.dispatch(resetAction);
    }
  };

  componentWillUnmount() {
    this.removeNotificationOpenedListener();
  }

  render() {
    const {
      loading,
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
          name={name}
          profile={profile}
          rating={rating}
          coin={coin}
          changeModalVisiblity={this.changeModalVisiblity}
          setData={this.setData}
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
