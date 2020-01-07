import React from 'react';
import {tv} from '../../../api/Api';
import NoticePresenter from './NoticePresenter';

export default class extends React.Component {
  // Title setting
  static navigationOptions = () => {
    return {
      title: '공지사항',
    };
  };

  // init 초기상태 값 설정
  state = {
    loading: true,
    noticeList: null,
    index: null,
    error: null,
  };

  async componentDidMount() {
    // let : 변할 수 있는 변수
    let noticeList, error;

    try {
      ({
        data: {results: noticeList},
      } = await tv.getPopular());
    } catch (error) {
      console.log('Notice get api ::: ' + error);
      error = "Cant't get Notice.";
    } finally {
      this.setState({
        loading: false,
        index: 0,
        error,
        noticeList,
      });
    }
  }

  // List 입력값 받아온다
  handleClickIndex = index => {
    if (this.state.index === index) {
      this.setState({
        index: 0,
      });
    } else {
      this.setState({
        index: index,
      });
    }
    console.log('getIndex ::: ' + index);
  };

  render() {
    const {loading, noticeList, index} = this.state;
    return (
      <NoticePresenter
        loading={loading}
        noticeList={noticeList}
        index={index}
        handleClickIndex={this.handleClickIndex}
      />
    );
  }
}
