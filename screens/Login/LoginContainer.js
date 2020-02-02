import React from 'react';
import LoginPresenter from './LoginPresenter';
import {LESPO_API, BASEURL, CONFIG} from '../../api/Api';
import KakaoLogins from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {Alert} from 'react-native';
import Firebase from 'react-native-firebase';
// import firebase from 'firebase';

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
      navigation: navigation,
      isKakaoLogging: false,
      token: 'token has not fetched',
      loading: true,
      email: '',
      name: '',
      password: '',
      signEmail: '',
      signPassword: '',
      res: null,
      loginCode: 1,
      error: null,
    };
  }

  async componentDidMount() {
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
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this._isMounted = false;
  }

  logCallback = (log, callback) => {
    console.log(log);
    console.log(JSON.stringify(callback));
  };

  setLoginLoading = () => {};
  setProfileLoading = () => {};
  // const setLogoutLoading = () => {};
  setToken = () => {};
  setProfile = () => {};
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
        this.setToken(result.accessToken);
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
  snsLoginApi = async params => {
    console.log('snsLoginApi');
  };

  // SNS 회원가입 + 로그인
  onSNSLogin = async (sns, result) => {
    console.log('onSNSLogin');
    if (sns === 'kakao') {
      const params = new URLSearchParams();
      params.append('provider', sns);
      params.append('id', result.id);
      params.append('name', result.nickname);
      console.log('kakao login api');
      try {
        console.log('try');
        await LESPO_API.login(params)
          .then(response => {
            console.log('response start');
            if (response.data.status === 'success') {
              console.log('== kakao login success ==');
              console.log(
                response.data.data.id.toString(),
                result.nickname,
                result.profile_image_url,
                sns,
              );
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
            }
          })
          .catch(error => {
            console.log('kakao login fail: ' + error);
          });
      } catch (error) {
        console.log('kakao login error : ' + error);
      }
      // await Axios.post(BASEURL + 'login/callback', params)
      //   .then(response => {
      //     if (response.data.status === 'success') {
      //       console.log('== kakao login success ==');
      //       console.log(
      //         response.data.data.id.toString(),
      //         result.nickname,
      //         result.profile_image_url,
      //         sns,
      //       );
      //       storeSNS(
      //         response.data.data.token,
      //         response.data.data.id.toString(),
      //         result.nickname,
      //         result.profile_image_url,
      //         sns,
      //       );
      //     }
      //   })
      //   .catch(error => {
      //     console.log('kakao login fail: ' + error);
      //   });
    } else if (sns === 'facebook') {
      const params = new URLSearchParams();
      params.append('provider', sns);
      params.append('id', result.id);
      params.append('name', result.name);
      await Axios.post(BASEURL + 'login/callback', params)
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
          }
        })
        .catch(error => {
          console.log('facebook login fail: ' + error);
        });
    } else {
    }
  };

  getProfile = async () => {
    console.log('     getProfile      ');
    this.logCallback('Get Profile Start', this.setProfileLoading(true));

    await KakaoLogins.getProfile()
      .then(result => {
        this.setProfile(result);
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

  render() {
    const {loading, email, password} = this.state;
    return (
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
    );

    // login 정보 check
    // if (email !== "" && password !== "" && loginCode !== "") {
    // }
  }
}
