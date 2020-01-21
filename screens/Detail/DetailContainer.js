import React from 'react';
import PropTypes from 'prop-types';
import DetailPresenter from './DetailPresenter';

export default class extends React.Component {
  static navigationOptions = () => {
    // return {
    //   title: navigation.getParam("title")
    // };
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: {id, poster, backgroundPoster, title, avg, overview, detail},
        },
      },
    } = props;
    this.state = {
      id,
      backgroundPoster,
      poster,
      title,
      avg,
      overview,
      detail,
      msg: '',
      like: false,
      wish: false,
    };
  }

  async componentDidMount() {
    console.log(this.state.backgroundPoster);
    console.log(JSON.stringify(this.state.poster));
  }

  handleMsgUpdate = text => {
    this.setState({
      msg: text,
    });
    console.log('handleMsgUpdate: ' + this.state.msg);
  };
  insertCommentList = msg => {
    if (msg !== null && msg !== '') {
      // 댓글 추가 api
      console.log('insertCommentList: 댓글이 있다: ' + msg);
    }
    this.setState({
      msg: '',
    });
  };

  // 좋아요
  likeUp = () => {
    this.setState({
      like: true,
    });
    console.log('likeUp: ' + this.state.like);
  };
  // 좋아요 취소
  likeDown = () => {
    this.setState({
      like: false,
    });
    console.log('likeDown: ' + this.state.like);
  };
  // 위시리스트 등록
  wishListIn = () => {
    this.setState({
      wish: true,
    });
    console.log('wishListIn: ' + this.state.wish);
  };
  // 위시리스트 취소
  wishListOut = () => {
    this.setState({
      wish: false,
    });
    console.log('wishListOut: ' + this.state.wish);
  };

  render() {
    const {
      id,
      backgroundPoster,
      poster,
      title,
      avg,
      overview,
      msg,
      like,
      wish,
      detail,
    } = this.state;
    return (
      <DetailPresenter
        id={id}
        backgroundPoster={backgroundPoster}
        poster={poster}
        title={title}
        avg={avg}
        overview={overview}
        msg={msg}
        handleMsgUpdate={this.handleMsgUpdate}
        insertCommentList={this.insertCommentList}
        like={like}
        likeUp={this.likeUp}
        likeDown={this.likeDown}
        wish={wish}
        wishListIn={this.wishListIn}
        wishListOut={this.wishListOut}
        detail={detail}
      />
    );
  }
}
