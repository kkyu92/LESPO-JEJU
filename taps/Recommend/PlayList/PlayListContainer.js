import React from "react";
import { Platform } from "react-native";
import PlayListPresenter from "./PlayListPresenter";
import { tv, movie } from "../../../api/Api";

export default class extends React.Component {
  state = {
    loading: true,
    listChanged: null,
    error: null
  };

  // 시작시 불러옴
  async componentDidMount() {
    let listChanged, error;
    try {
      ({
        data: { results: listChanged }
      } = await movie.getSearchMovie("play"));
    } catch (error) {
      console.log(error);
      error = "Cnat't get PlayList";
    } finally {
      this.setState({
        loading: false,
        listChanged,
        error
      });
    }
  }
  render() {
    const { loading, listChanged } = this.state;
    return <PlayListPresenter loading={loading} listChanged={listChanged} />;
  }
}
