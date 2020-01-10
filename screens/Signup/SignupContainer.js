import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import Layout from '../../constants/Layout';
import SignupPresenter from './SignupPresenter';
import {verifyEmail, verifyPassword, verifyName} from '../../constants/Regex';
import {Alert} from 'react-native';
import Axios from 'axios';
import {BASEURL} from '../../api/Api';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      navigation: navigation,
      loading: true,
      email: '',
      name: '',
      password: '',
      checkPassword: '',
      checked: false,
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
  // get Name text
  handleNameText = getName => {
    this.setState({
      name: getName,
    });
  };
  // get PasswordText
  handlePasswordText = getPassword => {
    this.setState({
      password: getPassword,
    });
  };
  // get checkPasswordText
  handleCheckPasswordText = getPassword => {
    this.setState({
      checkPassword: getPassword,
    });
  };
  // get CheckBox value
  handleCheckBox = getChecked => {
    this.setState({
      checked: getChecked,
    });
  };
  onSignup = async () => {
    const {email, password} = this.state;
    if (email === '' || password === '') {
      alert.toString('아이디와 비밀번호를 정확하게 입력해주세요.');
    } else {
      this.setState({
        loading: true,
      });
    }
  };
  //FIXME: 회원가입 성공시 가입정보 저장 [프로필사진 없음]
  storeData = async () => {
    try {
      await AsyncStorage.setItem('@USER_ID', this.state.email);
      await AsyncStorage.setItem('@USER_NAME', this.state.name);
      await AsyncStorage.setItem('@USER_PASSWORD', this.state.password);
      await AsyncStorage.setItem('@USER_PROFILE', '');
      console.log('(SignupContainer) save');
    } catch (e) {
      // saving error
      console.log('(SignupContainer) saving error: ' + e);
    }
  };
  // check Signup
  onCheckSignup = () => {
    const {email, name, password, checkPassword, checked} = this.state;
    if (
      email === '' ||
      password === '' ||
      checkPassword === '' ||
      name === ''
    ) {
      Alert.alert('', '빈공간이 없는지 확인해주세요.');
      //   console.log("빈공간이 없는지 확인해주세요.");
    } else if (password !== checkPassword) {
      Alert.alert('', '비밀번호가 일치하는지 확인해주세요.');
      //   console.log("비밀번호가 일치하는지 확인해주세요.");
    } else if (!checked) {
      Alert.alert('', '이용약관 및 개인정보 동의를 확인해주세요.');
      //   console.log("이용약관 및 개인정보 동의를 확인해주세요.");
    } else if (verifyEmail(email)) {
      Alert.alert('', '이메일 형식을 확인해주세요.');
    } else if (verifyName(name)) {
      Alert.alert('', '이름 형식을 확인해주세요.');
    } else if (verifyPassword(password)) {
      Alert.alert('', '비밀번호 형식을 확인해주세요.');
    } else {
      let loading, error;
      this.setState({
        loading: true,
      });
      try {
        const params = new URLSearchParams();
        params.append('email', email);
        params.append('name', name);
        params.append('password', password);
        Axios.post(BASEURL + 'register', params)
          .then(response => {
            console.log(JSON.stringify(response.data.messages.message));
            if (response.data.status === 'error') {
              Alert.alert('', JSON.stringify(response.data.messages.message));
            } else {
              this.storeData();
              this.state.navigation.goBack(null);
              Toast.show(name + '님의 회원가입이 완료되었습니다.', Toast.LONG);
            }
          })
          .catch(error => {
            console.log('register ' + error);
          });
      } catch (error) {
        error = "Can't check userInfo";
      } finally {
        this.setState({
          loading: false,
          error,
        });
      }
    }
    return;
  };

  render() {
    const {loading, checked} = this.state;
    return (
      <SignupPresenter
        loading={loading}
        checked={checked}
        handleEmailText={this.handleEmailText}
        handleNameText={this.handleNameText}
        handlePasswordText={this.handlePasswordText}
        handleCheckPasswordText={this.handleCheckPasswordText}
        handleCheckBox={this.handleCheckBox}
        onCheckSignup={this.onCheckSignup}
      />
    );
  }
}
