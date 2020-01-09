import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import Layout from '../../constants/Layout';
import SignupPresenter from './SignupPresenter';
import {verifyEmail, verifyPassword} from '../../constants/Regex';
import {Alert} from 'react-native';
import Axios from 'axios';
import {BASEURL} from '../../api/Api';

export default class extends React.Component {
  state = {
    loading: true,
    email: null,
    password: null,
    checkPassword: null,
    checked: false,
    error: null,
  };

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
  // check user info
  onCheckSignup = async () => {
    const {email, password, checkPassword, checked} = this.state;
    if (email === null || password === null || checkPassword === null) {
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
    } else if (verifyPassword(password)) {
      Alert.alert('', '비밀번호 형식을 확인해주세요.');
    } else {
      console.log('통과 :: ', this.state);
      let loading, checkUserResult, error;
      this.setState({
        loading: true,
      });
      try {
        const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);
        Axios.post(BASEURL + 'register', params)
          .then(response => {
            this.setState({
              checkUserResult: response.data.messages.email,
            });
            console.log(JSON.stringify(response.data.messages.email));
          })
          .catch(error => {
            console.log('register ' + error);
          });
      } catch (error) {
        error = "Can't check userInfo";
      } finally {
        this.setState({
          loading: false,
          checkUserResult,
          error,
        });
      }
    }
    console.log('onCheckSignup2');
    return;
  };

  render() {
    const {loading, checked} = this.state;
    return (
      <SignupPresenter
        loading={loading}
        checked={checked}
        handleEmailText={this.handleEmailText}
        handlePasswordText={this.handlePasswordText}
        handleCheckPasswordText={this.handleCheckPasswordText}
        handleCheckBox={this.handleCheckBox}
        onCheckSignup={this.onCheckSignup}
      />
    );
  }
}
