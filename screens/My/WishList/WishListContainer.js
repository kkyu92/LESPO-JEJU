import React from 'react';
import WishListPresenter from './WishListPresenter';
import {tv, movie} from '../../../api/Api';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '위시리스트',
    };
  };

  // init 초기상태 값 설정
  state = {
    loading: true,
    listChanged: null,
    error: null,
  };

  async componentDidMount() {
    // let : 변할 수 있는 변수
    let listChanged, error;

    try {
      ({
        data: {results: listChanged},
      } = await movie.getUpComing());
    } catch (error) {
      console.log('JejuSound get api ::: ' + error);
      error = "Cant't get Movies.";
    } finally {
      this.setState({
        loading: false,
        error,
        listChanged,
      });
    }
  }

  render() {
    const {loading, listChanged} = this.state;
    return <WishListPresenter loading={loading} listChanged={listChanged} />;
  }
}
