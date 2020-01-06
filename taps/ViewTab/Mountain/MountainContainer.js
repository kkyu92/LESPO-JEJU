import React from 'react';
import {Platform, View, Text} from 'react-native';
import MountainPresenter from './MountainPresenter';
import {tv, movie} from '../../../api/Api';

export default class extends React.Component {
  state = {
    loading: true,
    listChanged: null,
    error: null,
  };

  // 시작시 불러옴
  async componentDidMount() {
    let listChanged, error;
    try {
      ({
        data: {results: listChanged},
      } = await movie.getSearchMovie('mountain'));
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
  }
  render() {
    const {loading, listChanged} = this.state;
    // 위치정보 받기 전
    if (listChanged) {
      return <MountainPresenter loading={loading} listChanged={listChanged} />;
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>정보를 불러오는중입니다....</Text>
        </View>
      );
    }
  }
}