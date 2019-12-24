import React from "react";
import SearchPresenter from "./SearchPresenter";
import { movie } from "../../../api/Api";

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: "여행하기 검색"
    };
  };

  state = {
    loading: false,
    jejuResult: null,
    foodResult: null,
    playResult: null,
    seeResult: null,
    searchTerm: "",
    error: null
  };

  // text 입력값 받아온다
  handleSearchUpdate = text => {
    this.setState({
      searchTerm: text
    });
  };

  // 검색한 결과값
  onSubmitEditing = async () => {
    const { searchTerm } = this.state;
    if (searchTerm !== "") {
      let loading, jejuResult, error;
      this.setState({
        loading: true
      });
      try {
        ({
          data: { results: jejuResult }
        } = await movie.getSearchMovie(searchTerm));
      } catch {
        error = "Can't Search";
      } finally {
        this.setState({
          loading: false,
          jejuResult,
          error
        });
      }

      return;
    }
  };

  render() {
    const {
      loading,
      jejuResult,
      foodResult,
      playResult,
      seeResult,
      searchTerm
    } = this.state;
    return (
      <SearchPresenter
        loading={loading}
        jejuResult={jejuResult}
        foodResult={foodResult}
        playResult={playResult}
        seeResult={seeResult}
        searchTerm={searchTerm}
        onSubmitEditing={this.onSubmitEditing}
        handleSearchUpdate={this.handleSearchUpdate}
      />
    );
  }
}
