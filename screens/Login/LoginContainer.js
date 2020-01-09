import React from 'react';
import LoginPresenter from './LoginPresenter';
import {LESPO_API, BASEURL, CONFIG} from '../../api/Api';
import KakaoLogins from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {Alert} from 'react-native';

if (!KakaoLogins) {
  console.error('Module is Not Linked');
}

const logCallback = (log, callback) => {
  console.log(log);
  callback;
};

const setLoginLoading = () => {};
const setProfileLoading = () => {};
// const setLogoutLoading = () => {};
const setToken = () => {};
const setProfile = () => {};
const TOKEN_EMPTY = 'token has not fetched';
const PROFILE_EMPTY = {
  id: 'profile has not fetched',
  email: 'profile has not fetched',
  profile_image_url: '',
  nickname: '',
};

const kakaoLogin = () => {
  console.log('     kakaoLogin      ');
  logCallback('Login Start', setLoginLoading(true));

  KakaoLogins.login()
    .then(result => {
      setToken(result.accessToken);
      logCallback(
        `Login Finished:${JSON.stringify(result)}`,
        setLoginLoading(false),
        getProfile(),
      );
    })
    .catch(err => {
      if (err.code === 'E_CANCELLED_OPERATION') {
        logCallback(`Login Cancelled:${err.message}`, setLoginLoading(false));
      } else {
        logCallback(
          `Login Failed:${err.code} ${err.message}`,
          setLoginLoading(false),
        );
      }
    });
};

// const kakaoLogout = () => {
//   console.log('     kakaoLogout      ');
//   logCallback('Logout Start', setLogoutLoading(true));

//   KakaoLogins.logout()
//     .then(result => {
//       setToken(TOKEN_EMPTY);
//       setProfile(PROFILE_EMPTY);
//       logCallback(`Logout Finished:${result}`, setLogoutLoading(false));
//     })
//     .catch(err => {
//       logCallback(
//         `Logout Failed:${err.code} ${err.message}`,
//         setLogoutLoading(false),
//       );
//     });
// };
const storeData = async result => {
  try {
    await AsyncStorage.setItem('@USER_ID', result.id);
    await AsyncStorage.setItem('@USER_NAME', result.nickname);
    await AsyncStorage.setItem('@USER_PROFILE', result.profile_image_url);
  } catch (e) {
    // saving error
    console.log('saving error: ' + e);
  }
};

const getProfile = () => {
  console.log('     getProfile      ');
  logCallback('Get Profile Start', setProfileLoading(true));

  KakaoLogins.getProfile()
    .then(result => {
      setProfile(result);
      logCallback(
        `Get Profile Finished:${JSON.stringify(result)}`,
        setProfileLoading(false),
        storeData(result),
      );
    })
    .catch(err => {
      logCallback(
        `Get Profile Failed:${err.code} ${err.message}`,
        setProfileLoading(false),
      );
    });
};

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      navigation: navigation,
      isKakaoLogging: false,
      token: 'token has not fetched',
      loading: true,
      email: '',
      password: '',
      res: null,
      loginCode: 1,
      error: null,
    };
  }

  async componentDidMount() {
    let load, error;
    try {
      // load
    } catch (error) {
      error = "Can't load Login";
      console.log(error);
    } finally {
      this.setState({
        loading: false,
        error,
      });
    }
  }

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

  // check user info
  onSignup = async () => {
    const {email, password} = this.state;
    if (email === '' || password === '') {
      alert.toString('아이디와 비밀번호를 정확하게 입력해주세요.');
    } else {
      this.setState({
        loading: true,
      });
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);
      Axios.post(BASEURL + 'register', params)
        .then(response => {
          console.log(JSON.stringify(response.data.messages.email));
        })
        .catch(error => {
          console.log('register ' + error);
        });
      this.setState({
        loading: false,
      });
    }
  };
  // login Btn --> api(login) check
  onLogin = async () => {
    const {email, password} = this.state;
    if (email === '' || password === '') {
      Alert.alert('', '아이디와 비밀번호를 정확하게 입력해주세요.');
    } else {
      this.setState({
        loading: true,
      });
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);
      Axios.post(BASEURL + 'login', params)
        .then(response => {
          console.log(JSON.stringify(response.data));
          if (response.data.status !== 'error') {
            this.state.navigation.navigate({
              routeName: 'Tabs',
            });
          } else {
            Alert.alert('', response.data.messages.login);
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
    const {loading} = this.state;
    return (
      <LoginPresenter
        loading={loading}
        handleEmailUpdate={this.handleEmailText}
        handlePasswordUpdate={this.handlePasswordText}
        kakaoLogin={kakaoLogin}
        onLogin={this.onLogin}
        // kakaoLogout={kakaoLogout}
      />
    );

    // login 정보 check
    // if (email !== "" && password !== "" && loginCode !== "") {
    // }
  }
}
