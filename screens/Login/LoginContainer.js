import React from 'react';
import LoginPresenter from './LoginPresenter';
import {LESPO_API, BASEURL, CONFIG, TEST_API, movie} from '../../api/Api';
import KakaoLogins from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {Alert} from 'react-native';
import Firebase from 'react-native-firebase';
import {NavigationActions} from 'react-navigation';
import Toast from 'react-native-easy-toast';

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
  } catch (e) {
    console.log('saving error: ' + e);
  }
};
// 로그인 정보 저장 일반
const storeAPI = async (result, email, password) => {
  try {
    await AsyncStorage.setItem(
      '@API_TOKEN',
      'Bearer ' + result.data.data.token,
    );
    await AsyncStorage.setItem('@TOKEN', result.data.data.token);
    await AsyncStorage.setItem('@USER_ID', '' + result.data.data.id);
    await AsyncStorage.setItem('@USER_NAME', result.data.data.nickname);
    await AsyncStorage.setItem('@USER_PASSWORD', password);
    await AsyncStorage.setItem('@USER_PROFILE', '');
    await AsyncStorage.setItem('@AUTO_LOGIN', 'true');
    console.log('saving id: ' + result.data.data.id);
  } catch (error) {
    console.log('saving error: ' + error);
  }
};

export default class extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      navigation,
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
          this.saveNotiData(roomKey, id, name, profile);
          // this.props.navigation.navigation({routeName: 'Tabs'});
          this.props.navigation.replace({
            routeName: 'Tabs',
            action: NavigationActions.navigate({routeName: '내정보'}),
            // this.props.navigation.replace({
            //   routeName: 'MyBattleTalk',
            //   params: {
            //     roomKey,
            //     id,
            //     profile,
            //     name,
            //   },
            // }),
          });
        } else {
          console.log('not noti open');
        }
      });

    try {
      // const start = new Date();
      // await movie
      //   .getPopular()
      //   .then(response => {
      //     const timeTaken = new Date() - start;
      //     console.log('\n\n' + timeTaken + '\nMOVIE DATA\n\n');
      //     console.log(response.data.results);
      //   })
      //   .catch(error => {
      //     console.log('getMOVIE fail: ' + error);
      //   });
      // var params = {
      //   CMD: 'myInfo',
      //   PRM: {
      //     userKey: 124,
      //   },
      // };
      // const start1 = new Date();
      // await TEST_API.getTest(params)
      //   .then(response => {
      //     const timeTaken = new Date() - start1;
      //     console.log('\n\n' + timeTaken + '\nIM\n\n');
      //     console.log(response.data);
      //   })
      //   .catch(error => {
      //     console.log('getTEST[IM] fail: ' + error);
      //   });
      const start2 = new Date();
      await LESPO_API.getMainList()
        .then(response => {
          const timeTaken = new Date() - start2;
          console.log('\n\n' + timeTaken + '\nLESPO\n\n');
          console.log(response.data.messages);
        })
        .catch(error => {
          console.log('getnLESPO fail: ' + error);
        });
    } catch (e) {
      console.log(e);
    }

    // AUTO_LOGIN
    let AUTO_LOGIN = await AsyncStorage.getItem('@AUTO_LOGIN');
    if (AUTO_LOGIN === 'true') {
      this.state.navigation.replace({
        routeName: 'Tabs',
      });
    } else {
      console.log('log-out한 상태');
    }

    this._isMounted = true;
    this.getData();
    try {
      // load
    } catch (error) {
      error = "Can't load Login";
      console.log(error);
    } finally {
      this.setState({
        loading: false,
      });
    }
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        console.log('willFocus ::: reload');
        this.resetSignUpCheck();
      }),
    ];
  }

  resetSignUpCheck = async () => {
    try {
      this.getData();
      // sign up check
      let GET_SIGN_CHECK = await AsyncStorage.getItem('@SIGN_UP');
      let GET_USER_NAME = await AsyncStorage.getItem('@USER_NAME');
      console.log('signUpCheck: ' + GET_SIGN_CHECK);
      if ((await AsyncStorage.getItem('@SIGN_UP')) === 'true') {
        this.refs.toast.show(GET_USER_NAME + '님의 회원가입이 완료되었습니다.');
        await AsyncStorage.setItem('@SIGN_UP', '');
      } else {
        console.log('not sign up check');
      }
      this.setState({
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  saveNotiData = async (roomKey, id, name, profile) => {
    await AsyncStorage.setItem('@NOTI_ROOMKEY', roomKey);
    await AsyncStorage.setItem('@NOTI_ID', id);
    await AsyncStorage.setItem('@NOTI_NAME', name);
    await AsyncStorage.setItem('@NOTI_PROFILE', profile);
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

  // const kakaoLogout = () => {
  //   console.log('     kakaoLogout      ');
  //   this.logCallback('Logout Start', setLogoutLoading(true));

  //   KakaoLogins.logout()
  //     .then(result => {
  //       this.setToken(TOKEN_EMPTY);
  //       this.setProfile(PROFILE_EMPTY);
  //       this.logCallback(`Logout Finished:${result}`, setLogoutLoading(false));
  //     })
  //     .catch(err => {
  //       this.logCallback(
  //         `Logout Failed:${err.code} ${err.message}`,
  //         this.setLogoutLoading(false),
  //       );
  //     });
  // };
  kakaoLoginApi = async (sns, result) => {
    console.log('kakaoLoginApi');
  };

  // SNS 회원가입 + 로그인
  onSNSLogin = async (sns, result) => {
    console.log('onSNSLogin');
    // this.logCallback('Login Start', this.setApiLoading(true));
    if (sns === 'kakao') {
      const params = new URLSearchParams();
      params.append('provider', sns);
      params.append('id', result.id);
      params.append('name', result.nickname);
      console.log('kakao login api\n');
      await LESPO_API.login(params)
        .then(response => {
          this.logCallback(
            console.log(
              'response start: ' + JSON.stringify(response.data.data),
            ),
            storeSNS(
              response.data.data.token,
              response.data.data.id.toString(),
              result.nickname,
              result.profile_image_url,
              sns,
            ),
            this.state.navigation.replace({
              routeName: 'Tabs',
            }),
          );
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
      let M_Email = await AsyncStorage.getItem('@USER_ID');
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
          console.log(JSON.stringify(response.data.data));
          storeAPI(response, email, password);
          if (response.data.status !== 'error') {
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

  async componentWillUnmount() {
    console.log('componentWillUnmount');
    this._isMounted = false;
    let AUTO_LOGIN = await AsyncStorage.getItem('@AUTO_LOGIN');
    if (AUTO_LOGIN !== 'true') {
      this.subs.forEach(sub => sub.remove());
    }
  }

  render() {
    const {loading, email, password} = this.state;
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
        />
        <Toast
          ref="toast"
          style={{backgroundColor: '#fee6d0'}}
          position="bottom"
          positionValue={100}
          fadeInDuration={100}
          fadeOutDuration={2500}
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
