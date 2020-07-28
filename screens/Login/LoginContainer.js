import React from 'react';
import LoginPresenter from './LoginPresenter';
import {LESPO_API, BASEURL, CONFIG, TEST_API, movie} from '../../api/Api';
import KakaoLogins from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {Alert, Modal} from 'react-native';
import Firebase from 'react-native-firebase';
import firebase from 'firebase';
import {NavigationActions} from 'react-navigation';
import Toast from 'react-native-easy-toast';
import SimpleDialog from '../../components/SimpleDialog';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

if (!KakaoLogins) {
  console.error('Module is Not Linked');
}

// 로그인 정보 저장 SNS
const storeSNS = async (token, id, name, profile, provider) => {
  try {
    await AsyncStorage.setItem('@API_TOKEN', 'Bearer ' + token);
    await AsyncStorage.setItem('@TOKEN', token);
    await AsyncStorage.setItem('@USER_ID', id);
    await AsyncStorage.setItem('@USER_NAME', name);
    await AsyncStorage.setItem('@USER_PROFILE', profile);
    await AsyncStorage.setItem('@USER_PROVIDER', provider);
    await AsyncStorage.setItem('@AUTO_LOGIN', 'true');

    const FcmToken = await Firebase.messaging().getToken();
    await AsyncStorage.setItem('@FCM', FcmToken);
    await firebase
      .database()
      .ref('FcmTokenList')
      .update({
        [id]: FcmToken,
      })
      .then(data => {
        console.log('update my FcmToken: ', FcmToken);
      })
      .catch(error => {
        console.log('error ', error);
      });
    // const API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    await firebase
      .database()
      .ref('APITokenList')
      .update({
        [id]: 'Bearer ' + token,
      })
      .then(data => {
        console.log('update my APIToken: ', token);
      })
      .catch(error => {
        console.log('error ', error);
      });
  } catch (e) {
    console.log('saving error: ' + e);
  }
};
// 로그인 정보 저장 일반
const storeAPI = async (token, id, name, email, password) => {
  try {
    await AsyncStorage.setItem('@API_TOKEN', 'Bearer ' + token);
    await AsyncStorage.setItem('@TOKEN', token);
    await AsyncStorage.setItem('@USER_ID', id);
    await AsyncStorage.setItem('@USER_NAME', name);
    await AsyncStorage.setItem('@USER_EMAIL', email);
    await AsyncStorage.setItem('@USER_PASSWORD', password);
    await AsyncStorage.setItem('@USER_PROFILE', '');
    await AsyncStorage.setItem('@USER_PROVIDER', '');
    await AsyncStorage.setItem('@AUTO_LOGIN', 'true');

    const FcmToken = await Firebase.messaging().getToken();
    await AsyncStorage.setItem('@FCM', FcmToken);
    await firebase
      .database()
      .ref('FcmTokenList')
      .update({
        [id]: FcmToken,
      })
      .then(data => {
        console.log('update my FcmToken: ', FcmToken);
      })
      .catch(error => {
        console.log('error ', error);
      });
    await firebase
      .database()
      .ref('APITokenList')
      .update({
        [id]: 'Bearer ' + token,
      })
      .then(data => {
        console.log('update my APIToken: ', token);
      })
      .catch(error => {
        console.log('error ', error);
      });
  } catch (e) {
    console.log('saving error: ' + e);
  }
};

export default class extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      navigation,
      isModalVisible: false,
      isKakaoLogging: false,
      token: 'token has not fetched',
      loading: true,
      email: '',
      name: '',
      password: '',
      signEmail: '',
      signPassword: '',
      noti: false,
      res: null,
      loginCode: 1,
      error: null,
    };
  }

  async componentDidMount() {
    console.log('login componentDidMount');
    //TODO:  App was opened by a notification
    Firebase.notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          const notification = notificationOpen.notification.data;
          let roomKey = notification.roomKey;
          let id = notification.id;
          let name = notification.name;
          let profile = notification.profile;
          console.log('saveNotiData 시작: ' + roomKey);
          this.saveNotiData(roomKey, id, name, profile);
        } else {
          console.log('not noti open');
        }
      });

    try {
      // AUTO_LOGIN
      let AUTO_LOGIN = await AsyncStorage.getItem('@AUTO_LOGIN');
      let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
      let ID = await AsyncStorage.getItem('@USER_ID');
      firebase
        .database()
        .ref('APITokenList/' + ID)
        .once('value', dataSnapshot => {
          let otherToken = JSON.stringify(dataSnapshot);
          console.log(JSON.stringify(TOKEN));
          console.log(otherToken);
          if (AUTO_LOGIN === 'true') {
            if (otherToken === 'null') {
              this.refs.toast.show('탈퇴한 계정입니다.');
            } else if (JSON.stringify(TOKEN) === otherToken) {
              this.state.navigation.replace({
                routeName: 'Tabs',
              });
            } else {
              this.refs.toast.show('다른기기에 로그인 되어있습니다.');
            }
          } else {
            console.log('log-out한 상태');
          }
          this.setState({
            loading: false,
          });
        });

      this._isMounted = true;
      this.getData();
    } catch (e) {
      console.log(e);
    }
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        console.log('willFocus ::: reload');
        this.setState({
          loading: true,
        });
        this.resetSignUpCheck();
      }),
    ];
  }

  onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

    // get current authentication state for user
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
      appleAuthRequestResponse.email,
      appleAuthRequestResponse.fullName,
      appleAuthRequestResponse.identityToken,
    );
    Alert.alert(
      appleAuthRequestResponse.user +
        '\n' +
        appleAuthRequestResponse.email +
        '\n' +
        appleAuthRequestResponse.fullName +
        '\n' +
        appleAuthRequestResponse.identityToken,
    );
    console.log('credentialState::: ' + JSON.stringify(credentialState));
    // use credentialState response to ensure the user is authenticated
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      console.log('user is authenticated');
    }
  };

  resetSignUpCheck = async () => {
    try {
      this.getData();
      // sign up check
      let GET_SIGN_CHECK = await AsyncStorage.getItem('@SIGN_UP');
      let GET_USER_NAME = await AsyncStorage.getItem('@USER_NAME');
      console.log('signUpCheck: ' + GET_SIGN_CHECK);
      if ((await AsyncStorage.getItem('@SIGN_UP')) === 'true') {
        this.refs.toast.show(GET_USER_NAME + '님의 회원가입이 완료되었습니다.');
        await AsyncStorage.setItem('@SIGN_UP', 'false');
        this.setState({
          loading: false,
        });
      } else {
        console.log('not sign up check');
        this.setState({
          loading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  saveNotiData = async (roomKey, id, name, profile) => {
    await AsyncStorage.setItem('@NOTI_ROOMKEY', roomKey);
    await AsyncStorage.setItem('@NOTI_ID', id);
    await AsyncStorage.setItem('@NOTI_NAME', name);
    await AsyncStorage.setItem('@NOTI_PROFILE', profile);
    console.log('saveNotiData: 저장 끝나는 지점: ' + roomKey);
    // this.props.navigation.navigation({routeName: 'Tabs'});
    // this.props.navigation.replace({
    //   routeName: 'Tabs',
    //   action: NavigationActions.navigate({routeName: '메인'}),
    // });
  };

  logCallback = (log, callback) => {
    console.log(log);
    console.log(JSON.stringify(callback));
  };

  setLoginLoading = () => {};
  setProfileLoading = () => {};
  setApiLoading = () => {};
  // const setLogoutLoading = () => {};
  TOKEN_EMPTY = 'token has not fetched';
  PROFILE_EMPTY = {
    id: 'profile has not fetched',
    email: 'profile has not fetched',
    profile_image_url: '',
    nickname: '',
  };

  kakaoLogin = async () => {
    console.log('     kakaoLogin      ');
    this.logCallback('Login Start', this.setLoginLoading(true));

    await KakaoLogins.login()
      .then(result => {
        this.logCallback(
          `Login Finished:${JSON.stringify(result)}`,
          this.setLoginLoading(false),
          this.getProfile(),
        );
      })
      .catch(err => {
        if (err.code === 'E_CANCELLED_OPERATION') {
          this.logCallback(
            `Login Cancelled:${err.message}`,
            this.setLoginLoading(false),
          );
        } else {
          this.logCallback(
            `Login Failed:${err.code} ${err.message}`,
            this.setLoginLoading(false),
          );
        }
      });
  };

  kakaoLoginApi = async (sns, result) => {
    console.log('kakaoLoginApi');
  };

  // SNS 회원가입 + 로그인
  onSNSLogin = async (sns, result) => {
    console.log('onSNSLogin');
    if (sns === 'kakao') {
      const params = new URLSearchParams();
      params.append('provider', sns);
      params.append('id', result.id);
      params.append('name', result.nickname);
      console.log('kakao login api\n');
      await LESPO_API.login(params)
        .then(response => {
          console.log('response start: ' + JSON.stringify(response.data.data));
          if (response.data.status === 'success') {
            storeSNS(
              response.data.data.token,
              response.data.data.id.toString(),
              result.nickname,
              result.profile_image_url,
              sns,
            );
            this.state.navigation.replace({
              routeName: 'Tabs',
            });
          } else {
            Alert.alert('', response.data.messages.message);
          }
        })
        .catch(error => {
          this.logCallback(console.log('kakao login fail: ' + error));
        });
    } else if (sns === 'facebook') {
      const params = new URLSearchParams();
      params.append('provider', sns);
      params.append('id', result.id);
      params.append('name', result.name);
      await LESPO_API.login(params)
        .then(response => {
          if (response.data.status === 'success') {
            console.log('== facebook login success ==');
            console.log(
              response.data.data.id.toString(),
              result.name,
              result.picture.data.url,
              sns,
            );
            storeSNS(
              response.data.data.token,
              response.data.data.id.toString(),
              result.name,
              result.picture.data.url,
              sns,
            );
            this.state.navigation.replace({
              routeName: 'Tabs',
            });
          } else {
            Alert.alert('', response.data.messages.message);
          }
        })
        .catch(error => {
          console.log('facebook login fail: ' + error);
        });
    } else {
      const params = new URLSearchParams();
      params.append('provider', sns);
      params.append('id', result.response.id);
      params.append('name', result.response.name);
      await LESPO_API.login(params)
        .then(response => {
          if (response.data.status === 'success') {
            console.log('== Naver login success ==');
            console.log(
              response.data.data.id.toString(),
              result.response.name,
              result.response.profile_image,
              sns,
            );
            storeSNS(
              response.data.data.token,
              response.data.data.id.toString(),
              result.response.name,
              result.response.profile_image,
              sns,
            );
            this.state.navigation.replace({
              routeName: 'Tabs',
            });
          } else {
            Alert.alert('', response.data.messages.message);
          }
        })
        .catch(error => {
          console.log('Naver login fail: ' + error);
        });
    }
  };

  getProfile = async () => {
    console.log('     getProfile      ');
    this.logCallback('Get Profile Start', this.setProfileLoading(true));

    await KakaoLogins.getProfile()
      .then(result => {
        this.logCallback(
          this.onSNSLogin('kakao', result),
          // alert('Success fetching data: ' + JSON.stringify(result)),
          // `Get Profile Finished:${JSON.stringify(result)}`,
          this.setProfileLoading(false),
        );
      })
      .catch(err => {
        this.logCallback(
          `Get Profile Failed:${err.code} ${err.message}`,
          this.setProfileLoading(false),
        );
      });
  };

  // 회원가입 || 로그인했던 정보 가져오기
  getData = async () => {
    console.log('getData');
    try {
      let M_Email = await AsyncStorage.getItem('@USER_EMAIL');
      let M_Password = await AsyncStorage.getItem('@USER_PASSWORD');
      if (M_Email.includes('@')) {
        this.setState({
          email: M_Email,
          password: M_Password,
        });
        // console.log('sign email : ' + this.state.signEmail);
        // console.log('sign password : ' + this.state.signPassword);
      } else {
        console.log('마지막 로그인이 SNS 로그인이다');
      }
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

  // get Email text
  handleEmailText = getEmail => {
    this.setState({
      email: getEmail,
    });
  };
  // get PasswordText
  handlePasswordText = getPassword => {
    this.setState({
      password: getPassword,
    });
  };

  // login Btn --> api(login) check
  onLogin = async () => {
    console.log('login');
    const {email, name, password} = this.state;
    if (email === '' || password === '') {
      Alert.alert('', '아이디와 비밀번호를 정확하게 입력해주세요.');
    } else {
      this.setState({
        loading: true,
      });
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);
      params.append('name', name);
      await Axios.post(BASEURL + 'login', params)
        .then(response => {
          if (response.data.status !== 'error') {
            storeAPI(
              response.data.data.token,
              response.data.data.id.toString(),
              response.data.data.nickname,
              email,
              password,
            );
            this.state.navigation.replace({
              routeName: 'Tabs',
            });
          } else {
            Alert.alert('', response.data.messages.message);
          }
        })
        .catch(error => {
          console.log('login email: ' + email);
          console.log('login password: ' + password);
          console.log('login error: ' + error);
        });
      this.setState({
        loading: false,
      });
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

  setData = async (data, email) => {
    if (data === 'FIND') {
      const params = new URLSearchParams();
      params.append('email', email);
      LESPO_API.findPassword(params)
        .then(data => {
          this.refs.toast.show('임시비밀번호가 해당 이메일로 발송되었습니다.');
          console.log('send my password: ', data.data.messages.message);
        })
        .catch(error => {
          this.refs.toast.show(data.data.messages.message);
          console.log('find password error ', error);
        });
    }
    console.log('loginContainer: data = ' + data);
    console.log('loginContainer: data = ' + email);
  };

  async componentWillUnmount() {
    console.log('componentWillUnmount');
    this._isMounted = false;
    let AUTO_LOGIN = await AsyncStorage.getItem('@AUTO_LOGIN');
    if (AUTO_LOGIN !== 'true') {
      this.subs.forEach(sub => sub.remove());
    }
  }

  render() {
    const {loading, email, password, isModalVisible} = this.state;
    return (
      <>
        <LoginPresenter
          loading={loading}
          signEmail={email}
          signPassword={password}
          handleEmailUpdate={this.handleEmailText}
          handlePasswordUpdate={this.handlePasswordText}
          kakaoLogin={this.kakaoLogin}
          onSNSLogin={this.onSNSLogin}
          onLogin={this.onLogin}
          // kakaoLogout={kakaoLogout}
          changeModalVisiblity={this.changeModalVisiblity}
          onAppleButtonPress={this.onAppleButtonPress}
        />
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            battleState={'비밀번호찾기'}
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
        <Toast
          ref="toast"
          style={{backgroundColor: '#fee6d0'}}
          position="bottom"
          positionValue={100}
          fadeInDuration={100}
          fadeOutDuration={3000}
          opacity={1}
          textStyle={{color: '#000000'}}
        />
      </>
    );

    // login 정보 check
    // if (email !== "" && password !== "" && loginCode !== "") {
    // }
  }
}
