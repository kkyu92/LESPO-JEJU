import React from "react";
import Text from "react-native";
import styled from "styled-components";
import { tv } from "../../../api/Api";
import JejuGiftPresenter from "./JejuGiftPresenter";

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: "관광상품"
    };
  };

  // init 초기상태 값 설정
  state = {
    loading: true,
    getJejuSound: null,
    error: null
  };

  async componentDidMount() {
    // let : 변할 수 있는 변수
    let getJejuSound, error;

    try {
      ({
        data: { results: getJejuSound }
      } = await tv.getPopular());
    } catch (error) {
      console.log("JejuSound get api ::: " + error);
      error = "Cant't get Movies.";
    } finally {
      this.setState({
        loading: false,
        error,
        getJejuSound
      });
    }
  }

  render() {
    const { loading, getJejuSound } = this.state;
    return <JejuGiftPresenter loading={loading} getJejuSound={getJejuSound} />;
  }
}
