import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';
import {LESPO_API} from '../../../api/Api';
import JejuSoundPresenter from './JejuSoundPresenter';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '제주의 소리',
    };
  };

  // init 초기상태 값 설정
  state = {
    loading: true,
    listChanged: null,
    error: null,
  };

  async componentDidMount() {
    let listChanged = [];
    let error;
    try {
      ({
        data: {data: listChanged},
      } = await LESPO_API.getJejuSound());
      // console.log('Reco Food List : ' + JSON.stringify(listChanged));
    } catch (error) {
      console.log('JejuSound get api ::: ' + error);
      error = "Cant't get Movies.";
    } finally {
      this.setState({
        loading: false,
        listChanged: listChanged,
        error,
      });
    }
  }

  render() {
    const {loading, listChanged} = this.state;
    if (listChanged) {
      return <JejuSoundPresenter loading={loading} listChanged={listChanged} />;
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>위치정보를 불러오는중입니다....</Text>
        </View>
      );
    }
  }
}
