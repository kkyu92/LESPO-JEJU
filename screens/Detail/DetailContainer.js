import React from 'react';
import DetailPresenter from './DetailPresenter';
import {LESPO_API} from '../../api/Api';
import AsyncStorage from '@react-native-community/async-storage';
import {Keyboard} from 'react-native';
import Toast from 'react-native-easy-toast';
import Firebase from 'react-native-firebase';
import Animated from 'react-native-reanimated';
import KakaoSDK from 'react-native-kakao-links';
import {CHAT_ROOM_IN} from '../../constants/Strings';

export default class extends React.Component {
  static navigationOptions = () => {
    // return {
    //   title: navigation.getParam("title")
    // };
  };

  constructor(props) {
    super(props);
    const {navigation} = this.props;
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
      navigation,
      msg: '',
    };
    this.rowTranslateAnimatedValues = {};
    Array(20)
      .fill('')
      .forEach((_, i) => {
        this.rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
      });
  }

  async componentDidMount() {
    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      // 화면에 들어와있을 때 알림
      this.removeToastListener = Firebase.notifications().onNotification(
        notification => {
          if (notification.android._notification._data.msg !== CHAT_ROOM_IN) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                ' : ' +
                notification.android._notification._data.msg,
            );
          }
        },
      );
    } else {
      try {
        Firebase.messaging().requestPermission();
      } catch (error) {
        alert('user reject permission');
      }
    }
    // 최소화에서 들어옴
    this.removeNotificationOpenedListener = Firebase.notifications().onNotificationOpened(
      notificationOpen => {
        const notification = notificationOpen.notification.data;
        console.log('onNotificationOpened : ' + JSON.stringify(notification));
        this.state.navigation.navigate({
          routeName: 'BattleTalk',
          params: {
            roomKey: notification.roomKey,
            id: notification.id,
            profile: notification.profile,
            name: notification.name,
          },
        });
      },
    );
    this.onDetailChanging();
    console.log('wishID :: ' + this.state.wishId);
    console.log('likeID :: ' + this.state.likeId);
  }

  onDetailChanging = async () => {
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
          listChanged = response.data.data;
          console.log('get list: ' + JSON.stringify(listChanged));
          if (JSON.stringify(listChanged.matched_content_images) === '[]') {
            this.setState({
              backgroundPoster: 'no',
              poster: 'no',
              title: listChanged.title,
              avg: listChanged.like_count,
              overview: listChanged.description,
              detail: listChanged.detail,
              isWish: listChanged.is_wishlist_added_count,
              isLike: listChanged.is_liked_count,
              comments: listChanged.comments,
            });
          } else {
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
          }
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
  };

  handleMsgUpdate = text => {
    this.setState({
      msg: text,
    });
    console.log('handleMsgUpdate: ' + this.state.msg);
  };

  insertCommentList = async msg => {
    Keyboard.dismiss();
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
          console.log('SUCCESS: ' + JSON.stringify(response.data.data));
          this.setState({
            msg: '',
          });
        })
        .catch(error => {
          console.log('add Comment fail: ' + error);
        });
      await LESPO_API.getDetailItem(this.state.id, config)
        .then(response => {
          let listChanged = response.data.data;
          this.setState({
            comments: listChanged.comments,
          });
        })
        .catch(error => {
          console.log('update comments fail: ' + error);
        });
    }
  };

  kakaoLink = async (title, desc, img, id) => {
    try {
      const options = {
        objectType: 'custom', //required
        templateId: '20614', //required
        templateArgs: {
          title: title, //Your Param
          desc: desc, //Your Param
          img: img,
          android: id,
          ios: id,
        },
      };
      const response = await KakaoSDK.link(options);
      console.log(response);
    } catch (error) {
      console.log('kakaoLink error : ' + error);
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

  //TODO: swiperDelete 사용자 본인인지 체크 후 삭제 아닐경우 불가 TOAST
  deleteComment = async (id, userId) => {
    let MY_ID = await AsyncStorage.getItem('@USER_ID');
    if (userId == MY_ID) {
      let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
      const config = {
        headers: {
          Authorization: TOKEN,
        },
      };
      await LESPO_API.deleteComment(config, id)
        .then(response => {
          console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log('deleteWishList fail: ' + error);
        });
      this.onDetailChanging();
      this.refs.toast.show('댓글을 삭제했습니다.');
    } else {
      this.refs.toast.show('본인이 작성한 댓글만 삭제가 가능합니다.');
    }
  };

  componentWillUnmount() {
    console.log('componentWillUnmount[DetailContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
  }

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
      <>
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
          kakaoLink={this.kakaoLink}
          isLike={isLike}
          likeUp={this.likeUp}
          likeDown={this.likeDown}
          isWish={isWish}
          wishListIn={this.wishListIn}
          wishListOut={this.wishListOut}
          detail={detail}
          comments={comments}
          deleteComment={this.deleteComment}
          reco={reco}
        />
        <Toast
          ref="toast"
          style={{backgroundColor: '#fee6d0'}}
          position="bottom"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{color: '#000000'}}
        />
      </>
    );
  }
}
