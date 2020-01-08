import React from 'react';
import {Platform} from 'react-native';
import SportsPresenter from './SportsPresenter';
import {tv, movie} from '../../api/Api';

export default class extends React.Component {
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
        data: {results: listChanged},
      } = await movie.getSearchMovie('default'));
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
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        console.log('willFocus ::: reload');
        this.onListChanging();
      }),
    ];
  }

  // 언제쓰이는지 아직 모름
  componentWillUnmount() {
    console.log('componentWillUnmount ::: ');
    this.subs.forEach(sub => sub.remove());
  }

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
          } = await movie.getSearchMovie('latest'));
        } else if (listName === 'battle') {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('battle'));
        } else if (listName === 'nearest') {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('nearest'));
        } else {
          ({
            data: {results: listChanged},
          } = await movie.getSearchMovie('default'));
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
    const {loading, popular, listName, listChanged} = this.state;
    return (
      <SportsPresenter
        loading={loading}
        popular={popular}
        listName={listName}
        listChanged={listChanged}
        onListChanging={this.onListChanging}
        handleListUpdate={this.handleListUpdate}
      />
    );
  }
}
