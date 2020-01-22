import React from 'react';
import Text from 'react-native';
import styled from 'styled-components';
import {tv, movie, LESPO_API} from '../../../api/Api';
import JejuGiftPresenter from './JejuGiftPresenter';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '관광상품',
    };
  };

  // init 초기상태 값 설정
  state = {
    loading: true,
    listName: null,
    listChanged: null,
    error: null,
  };

  // 시작시 불러옴
  async componentDidMount() {
    let listChanged, error;
    try {
      ({
        data: {data: listChanged},
      } = await LESPO_API.getJejuAd());
    } catch (error) {
      console.log(error);
      error = "Cnat't get TV";
    } finally {
      this.setState({
        loading: false,
        listChanged,
        error,
      });
    }
    // 화면 돌아왔을 때 reload !
    // this.subs = [
    //   this.props.navigation.addListener('willFocus', () => {
    //     console.log('willFocus ::: reload');
    //     this.onListChanging();
    //   }),
    // ];
  }

  // 새로고침
  // componentWillUnmount() {
  //   console.log('componentWillUnmount ::: ');
  //   this.subs.forEach(sub => sub.remove());
  // }

  // List 입력값 받아온다
  handleListUpdate = list => {
    this.setState({
      listName: list,
    });
    console.log('getListName ::: ' + list);
    if (Platform.OS === 'android') {
      console.log('go Android ::: ' + list);
      this.state.listName = list;
      this.onListChanging();
    }
  };

  // 검색한 결과값
  onListChanging = async () => {
    const {listName} = this.state;
    if (listName !== '') {
      console.log('listChanging ::: ' + listName);
      let listChanged, error;
      this.setState({
        loading: true,
      });
      try {
        if (listName === 'latest') {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('new'));
        } else if (listName === 'likes') {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('good'));
        } else if (listName === 'nearest') {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('near'));
        } else {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('new'));
        }
      } catch {
        error = "Can't Search";
      } finally {
        this.setState({
          loading: false,
          listChanged,
          listName,
          error,
        });
      }
      return;
    }
  };

  render() {
    const {loading, listName, listChanged} = this.state;
    return (
      <JejuGiftPresenter
        loading={loading}
        listName={listName}
        listChanged={listChanged}
        onListChanging={this.onListChanging}
        handleListUpdate={this.handleListUpdate}
      />
    );
  }
}
