import React from 'react';
import LoginPresenter from './LoginPresenter';
import KakaoLogins from '@react-native-seoul/kakao-login';

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

const getProfile = () => {
  console.log('     getProfile      ');
  logCallback('Get Profile Start', setProfileLoading(true));

  KakaoLogins.getProfile()
    .then(result => {
      setProfile(result);
      logCallback(
        `Get Profile Finished:${JSON.stringify(result)}`,
        setProfileLoading(false),
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
    this.state = {
      isKakaoLogging: false,
      token: 'token has not fetched',
      loading: true,
      email: 'email@gmail.com',
      password: '1234567r',
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
  onCheckUser = async () => {
    const {email, password} = this.state;
    if (email === '' || password === '') {
      alert.toString('아이디와 비밀번호를 정확하게 입력해주세요.');
    } else {
      let loading, checkUserResult, error;
      this.setState({
        loading: true,
      });
      try {
        // ({
        //   data: { results: jejuResult }
        // } = await movie.getSearchMovie(searchTerm));
        checkUserResult = 'OK';
      } catch (error) {
        error = "Can't check userInfo";
      } finally {
        this.setState({
          loading: false,
          checkUserResult,
          error,
        });
        return;
      }
    }
  };
  // login Btn --> api(login) check
  // onLogin() {
  //   const { email, password, loginCode } = this.state;
  // }

  render() {
    const {loading, email, password} = this.state;
    return (
      <LoginPresenter
        loading={loading}
        email={email}
        password={password}
        kakaoLogin={kakaoLogin}
        // kakaoLogout={kakaoLogout}
      />
    );

    // login 정보 check
    // if (email !== "" && password !== "" && loginCode !== "") {
    // }
  }
}
