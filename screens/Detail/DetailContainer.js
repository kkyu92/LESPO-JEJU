import React from 'react';
import DetailPresenter from './DetailPresenter';
import {LESPO_API} from '../../api/Api';
import AsyncStorage from '@react-native-community/async-storage';
import {Keyboard, Modal, Platform} from 'react-native';
import Toast from 'react-native-easy-toast';
import Firebase from 'react-native-firebase';
import Animated from 'react-native-reanimated';
import RNKakaoLink from 'react-native-kakao-links';
import Share from 'react-native-share';
import {CHAT_ROOM_IN, ROOM_OUT} from '../../constants/Strings';
import SimpleDialog from '../../components/SimpleDialog';
import GetPhoto from '../../api/GetPhoto';

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
      isModalVisible: false,
      modal: null,
    };
    this.rowTranslateAnimatedValues = {};
    Array(20)
      .fill('')
      .forEach((_, i) => {
        this.rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
      });
  }

  async componentDidMount() {
    await AsyncStorage.setItem('@DETAIL_PAGE', 'true');
    // fcm setting
    const enable = await Firebase.messaging().hasPermission();
    if (enable) {
      // 화면에 들어와있을 때 알림
      this.removeToastListener = Firebase.notifications().onNotification(
        notification => {
          if (
            notification.android._notification._data.msg !== CHAT_ROOM_IN &&
            notification.android._notification._data.msg !== ROOM_OUT
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                ' : ' +
                notification.android._notification._data.msg,
            );
          } else if (
            notification.android._notification._data.msg === ROOM_OUT
          ) {
            this.refs.toast.show(
              notification.android._notification._data.name +
                '님이 채팅방을 나갔습니다.',
            );
          }
        },
      );
    } else {
      this.removeToastListener = () => {};
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
          // console.log('get list: ' + JSON.stringify(listChanged));
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

  // {
  //   excludeActivityTypes: [
  //     'com.apple.UIKit.activity.PostToWeibo',
  //     'com.apple.UIKit.activity.Print',
  //     'com.apple.UIKit.activity.CopyToPasteboard',
  //     'com.apple.UIKit.activity.AssignToContact',
  //     'com.apple.UIKit.activity.SaveToCameraRoll',
  //     'com.apple.UIKit.activity.AddToReadingList',
  //     'com.apple.UIKit.activity.PostToFlickr',
  //     'com.apple.UIKit.activity.PostToVimeo',
  //     'com.apple.UIKit.activity.PostToTencentWeibo',
  //     'com.apple.UIKit.activity.AirDrop',
  //     'com.apple.UIKit.activity.OpenInIBooks',
  //     'com.apple.UIKit.activity.MarkupAsPDF',
  //     'com.apple.reminders.RemindersEditorExtension',
  //     'com.apple.mobilenotes.SharingExtension',
  //     'com.apple.mobileslideshow.StreamShareService',
  //     'com.linkedin.LinkedIn.ShareExtension',
  //     'pinterest.ShareExtension',
  //     'com.google.GooglePlus.ShareExtension',
  //     'com.tumblr.tumblr.Share-With-Tumblr',
  //     'net.whatsapp.WhatsApp.ShareExtension',
  //   ],
  // },

  elseLink = async () => {
    // console.log('' + img);
    // const url = `data : image / png; base64, ${img} `;
    const options = {
      title: this.state.title,
      message: this.state.title + '\n' + this.state.overview,
      url:
        Platform.OS === 'android'
          ? '\nhttps://play.google.com/store/apps/details?id=com.lespojeju'
          : '\nttps://play.google.com/store/apps/details?id=com.lespojeju',
    };
    await Share.open(options)
      .then(res => {
        console.log('Shared: ' + res);
      })
      .catch(err => {
        console.log('Error: ' + err);
      });
  };

  kakaoLink = async (title, desc, img, id) => {
    // console.log('' + img);
    // const url = `data : image / png; base64, ${img} `;
    // const options = {
    //   title: title,
    //   message: title + '\n' + desc,
    //   url: '\nhttps://play.google.com/store/apps/details?id=com.lespojeju',
    //   showAppsToView: true,
    // };
    // Share.open(options)
    //   .then(res => {
    //     console.log('Shared: ' + res);
    //   })
    //   .catch(err => {
    //     console.log('Error: ' + err);
    //   });
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
      const response = await RNKakaoLink.link(options);
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

  changeModalVisiblity = modal => {
    if (modal === false) {
      this.setState({
        isModalVisible: false,
      });
    } else {
      this.setState({
        isModalVisible: true,
        modal: modal,
      });
    }
  };

  setData = async data => {
    if (data === 'kakao') {
      this.kakaoLink(
        this.state.title,
        this.state.overview,
        GetPhoto(this.state.backgroundPoster),
        'id=' + this.state.id,
      );
    } else {
      // this.elseLink();
      const options = {
        title: this.state.title,
        message: this.state.title + '\n' + this.state.overview,
        url:
          Platform.OS === 'android'
            ? '\nhttps://play.google.com/store/apps/details?id=com.lespojeju'
            : '\nhttps://itunes.apple.com/kr/app/apple-store/JejuBattle',
      };
      Share.open(options)
        .then(res => {
          console.log('Shared: ' + res);
        })
        .catch(err => {
          console.log('Error: ' + err);
        });
    }
  };

  componentWillUnmount = async () => {
    console.log('componentWillUnmount[DetailContainer]');
    await AsyncStorage.setItem('@DETAIL_PAGE', 'false');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
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
      modal,
      isModalVisible,
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
          changeModalVisiblity={this.changeModalVisiblity}
        />
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            battleState={modal}
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
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
