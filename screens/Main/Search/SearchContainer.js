import React from 'react';
import SearchPresenter from './SearchPresenter';
import {movie, LESPO_API} from '../../../api/Api';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '여행하기 검색',
    };
  };

  state = {
    loading: false,
    jejuResult: null,
    searchTerm: '',
    error: null,
  };

  // async componentDidMount() {
  //   let {jejuResult, searchTerm, error} = this.state;
  //   try {
  //     ({
  //       data: {data: jejuResult},
  //     } = await LESPO_API.getSearchList(searchTerm));
  //     this.setState({
  //       loading: false,
  //       jejuResult: jejuResult,
  //       error,
  //     });
  //     console.log(JSON.stringify(jejuResult));
  //   } catch (error) {
  //     // error = "Can't Search";
  //   } finally {
  //     console.log('finally: ' + jejuResult);
  //   }
  // }

  // text 입력값 받아온다
  handleSearchUpdate = text => {
    this.setState({
      searchTerm: text,
    });
    console.log(this.state.searchTerm);
  };

  // 검색한 결과값
  onSubmitEditing = async () => {
    const {searchTerm} = this.state;
    console.log(searchTerm);
    if (searchTerm !== '') {
      let loading, jejuResult, error;
      this.setState({
        loading: true,
      });
      try {
        ({
          data: {data: jejuResult},
        } = await LESPO_API.getSearchList(searchTerm));
        this.setState({
          loading: false,
          jejuResult,
          error,
        });
        console.log(JSON.stringify(jejuResult));
      } catch {
        error = "Can't Search";
      }
      return;
    }
  };

  render() {
    const {loading, jejuResult, searchTerm} = this.state;
    return (
      <SearchPresenter
        loading={loading}
        jejuResult={jejuResult}
        searchTerm={searchTerm}
        onSubmitEditing={this.onSubmitEditing}
        handleSearchUpdate={this.handleSearchUpdate}
      />
    );
  }
}
