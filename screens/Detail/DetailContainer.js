import React from 'react';
import PropTypes from 'prop-types';
import DetailPresenter from './DetailPresenter';
import {LESPO_API} from '../../api/Api';
import AsyncStorage from '@react-native-community/async-storage';

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
          params: {
            id,
            backgroundPoster,
            poster,
            title,
            avg,
            overview,
            detail,
            isWish,
            isLike,
            comments,
            wishId,
            likeId,
            reco,
          },
        },
      },
    } = props;
    this.state = {
      loading: true,
      id,
      backgroundPoster,
      poster,
      title,
      avg,
      overview,
      detail,
      isWish,
      isLike,
      comments,
      wishId,
      likeId,
      reco,
      msg: '',
    };
  }

  async componentDidMount() {
    let listChanged;
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    try {
      console.log('get id : ' + this.state.id);
      await LESPO_API.getDetailItem(this.state.id, config)
        .then(response => {
          console.log(JSON.stringify(response.data.data));
          listChanged = response.data.data;
          this.setState({
            backgroundPoster:
              listChanged.matched_content_images[0].full_filename,
            poster: listChanged.matched_content_images,
            title: listChanged.title,
            avg: listChanged.like_count,
            overview: listChanged.description,
            detail: listChanged.detail,
            isWish: listChanged.is_wishlist_added_count,
            isLike: listChanged.is_liked_count,
            comments: listChanged.comments,
          });
        })
        .catch(error => {
          console.log('get DetailItem fail: ' + error);
        });
    } catch (error) {
      console.log("Cant't get Detail. : " + error);
    } finally {
      if (listChanged.wishlist_id !== null) {
        this.setState({
          wishId: listChanged.wishlist_id.id,
        });
      } else {
        this.setState({
          wishId: listChanged.wishlist_id,
        });
      }
      if (listChanged.like_id !== null) {
        this.setState({
          likeId: listChanged.like_id.id,
        });
      } else {
        this.setState({
          likeId: listChanged.like_id,
        });
      }
      this.setState({
        loading: false,
      });
    }
    console.log('wishID :: ' + this.state.wishId);
    console.log('likeID :: ' + this.state.likeId);
  }

  handleMsgUpdate = text => {
    this.setState({
      msg: text,
    });
    console.log('handleMsgUpdate: ' + this.state.msg);
  };

  insertCommentList = async msg => {
    let commentList = this.state.comments;
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    if (msg !== null && msg !== '') {
      // 댓글 추가 api
      console.log('insertComment: ' + msg);
      const params = new URLSearchParams();
      params.append('contentId', this.state.id);
      params.append('comment', msg);
      await LESPO_API.addComment(params, config)
        .then(response => {
          console.log(JSON.stringify(response.data.data));
          commentList.push(response.data.data);
          this.setState({
            comments: commentList,
            msg: '',
          });
          console.log('comments::::: ' + JSON.stringify(this.state.comments));
        })
        .catch(error => {
          console.log('addLike fail: ' + error);
        });
    }
  };

  // 좋아요
  likeUp = async () => {
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    this.setState({
      isLike: 1,
      avg: this.state.avg + 1,
    });
    console.log('likeUp: ' + this.state.isLike);
    const params = new URLSearchParams();
    params.append('contentId', this.state.id);
    await LESPO_API.addLike(params, config)
      .then(response => {
        console.log(JSON.stringify(response.data.data));
        this.setState({
          likeId: response.data.data.id,
        });
        console.log('likeId::::: ' + JSON.stringify(this.state.likeId));
      })
      .catch(error => {
        console.log('addLike fail: ' + error);
      });
  };

  // 좋아요 취소
  likeDown = async () => {
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    this.setState({
      isLike: 0,
      avg: this.state.avg - 1,
    });
    console.log('likeDown: ' + this.state.isLike);
    await LESPO_API.deleteLike(config, this.state.likeId)
      .then(response => {
        console.log(JSON.stringify(response.data));
        this.setState({
          likeId: null,
        });
        console.log('likeId::::: ' + JSON.stringify(this.state.likeId));
      })
      .catch(error => {
        console.log('addLike fail: ' + error);
      });
  };

  // 위시리스트 등록
  wishListIn = async () => {
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    this.setState({
      isWish: 1,
    });
    console.log('wishListIn: ' + this.state.isWish);
    const params = new URLSearchParams();
    params.append('contentId', this.state.id);
    await LESPO_API.addWishList(params, config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        this.setState({
          wishId: response.data.data.id,
        });
        console.log('wishId::::: ' + JSON.stringify(this.state.wishId));
      })
      .catch(error => {
        console.log('addWishList fail: ' + error);
      });
  };

  // 위시리스트 취소
  wishListOut = async () => {
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    this.setState({
      isWish: 0,
    });
    console.log('wishListOut: ' + this.state.isWish);
    await LESPO_API.deleteWishList(config, this.state.wishId)
      .then(response => {
        console.log(JSON.stringify(response.data));
        this.setState({
          wishId: null,
        });
        console.log('wishId::::: ' + JSON.stringify(this.state.wishId));
      })
      .catch(error => {
        console.log('deleteWishList fail: ' + error);
      });
  };

  render() {
    const {
      loading,
      id,
      backgroundPoster,
      poster,
      title,
      avg,
      overview,
      msg,
      detail,
      isLike,
      isWish,
      comments,
      reco,
    } = this.state;
    return (
      <DetailPresenter
        loading={loading}
        id={id}
        backgroundPoster={backgroundPoster}
        poster={poster}
        title={title}
        avg={avg}
        overview={overview}
        msg={msg}
        handleMsgUpdate={this.handleMsgUpdate}
        insertCommentList={this.insertCommentList}
        isLike={isLike}
        likeUp={this.likeUp}
        likeDown={this.likeDown}
        isWish={isWish}
        wishListIn={this.wishListIn}
        wishListOut={this.wishListOut}
        detail={detail}
        comments={comments}
        reco={reco}
      />
    );
  }
}
