import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import BattlePresenter from './BattlePresenter';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Toast from 'react-native-easy-toast';
import Firebase from 'react-native-firebase';
import {LESPO_API} from '../../../api/Api';
import {CHAT_ROOM_IN} from '../../../constants/Strings';

var nowDate = moment().format('YYYY-MM-DD');
var makeDate;
var M_ID = '';
var M_NAME = '';
var M_PROFILE = '';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: true,
      myId: M_ID,
      myName: M_NAME,
      myProfile: M_PROFILE,
      sport: '스포츠',
      area: '지역',
      type: '타입',
      date: nowDate,
      level: '실력',
      memo: '',
      rating: 5,
      error: null,
      navigation: navigation,
    };
  }

  // Title setting
  static navigationOptions = () => {
    return {
      title: '스포츠 배틀',
    };
  };

  // picker 값 받아옴
  setSportChange = selected => {
    console.log('setSportChange fun ::: ' + selected);
    this.setState({
      sport: selected,
    });
    // this.state.sport = selected;
    // console.log("get state.sport ::: " + this.state.sport);
  };
  setAreaChange = selected => {
    console.log('setAreaChange fun ::: ' + selected);
    this.setState({
      area: selected,
    });
  };
  setTypeChange = selected => {
    console.log('setTypeChange fun ::: ' + selected);
    this.setState({
      type: selected,
    });
  };
  setDateChange = selected => {
    this.state.date = selected;
    this.setState({
      date: selected,
    });
    console.log('setDateChange fun ::: ' + this.state.date);
    // this.onDateChanging();
  };
  setLevelChange = selected => {
    console.log('setLevelChange fun ::: ' + selected);
    this.setState({
      level: selected,
    });
  };
  setMemoChange = selected => {
    console.log('setMemoChange fun ::: ' + selected);
    this.setState({
      memo: selected,
    });
  };

  // * battleResult ( 배틀 결과 )
  //   * win
  //   * lose

  // write Data [ set / push = uuid ]
  writeChatRoomAdd(
    makeUser,
    joinUser,
    chatList,
    date,
    sports,
    area,
    battleStyle,
    battleDate,
    level,
    memo,
    battleState,
    battleResult,
    endUser,
    openBox,
  ) {
    firebase
      .database()
      .ref('chatRoomList/')
      .push({
        makeUser,
        joinUser,
        chatList,
        date,
        sports,
        area,
        battleStyle,
        battleDate,
        level,
        memo,
        battleState,
        battleResult,
        endUser,
        openBox,
      })
      .then(data => {
        //success callback
        console.log('writeChatRoomAdd: ', data);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  }

  getData = async () => {
    console.log('getData');
    try {
      M_ID = await AsyncStorage.getItem('@USER_ID');
      M_NAME = await AsyncStorage.getItem('@USER_NAME');
      M_PROFILE = await AsyncStorage.getItem('@USER_PROFILE');
      if (M_PROFILE !== null || M_PROFILE !== '') {
        this.setState({
          myId: M_ID,
          myName: M_NAME,
          myProfile: M_PROFILE,
        });
        console.log('myName : ' + this.state.myName);
        console.log('myProfile : ' + this.state.myProfile);
      } else {
        console.log('Login profile image null');
      }
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

  // init 초기값
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
    let insertBattle, error;
    try {
      this.getData();
      let API_TOKEN = await AsyncStorage.getItem('@API_TOKEN');
      const config = {
        headers: {
          Authorization: API_TOKEN,
        },
      };
      await LESPO_API.getRating(config)
        .then(response => {
          this.setState({
            rating: response.data.data.rating,
          });
        })
        .catch(error => {
          console.log('getRating fail: ' + error);
        });
    } catch (error) {
      console.log('insert Battle api error ::: ' + error);
      error = "Cant't insert Battle.";
    } finally {
      this.setState({
        loading: false,
        error,
        insertBattle,
      });
    }
  }

  // Screen out
  componentWillUnmount() {
    console.log('componentWillUnmount[AddBattleContainer]');
    this.removeToastListener();
    this.removeNotificationOpenedListener();
    firebase
      .database()
      .ref('chatRoomList/')
      .off();
  }

  // date change
  onDateChanging = async () => {
    const {date} = this.state.date;
    // if (date !== "") {
    console.log('date Changing ::: ' + date);

    return;
    // }
  };

  // 배틀 추가하는 api 따로 생성
  updateBattle = async () => {
    let error;
    let makeUser = {
      userIn: false,
      userId: this.state.myId,
      userName: this.state.myName,
      userProfile: this.state.myProfile ? this.state.myProfile : '',
      userRating: this.state.rating,
    };
    let joinUser = {
      userIn: false,
      userId: '',
      userName: '',
      userProfile: '',
      userRating: '',
    };
    let battleResult = {
      win: '',
      lose: '',
    };
    let chatList = '';
    let endUser = {
      user1: '',
      user2: '',
    };
    let openBox = false;
    let requestUser = '';
    if (
      this.state.sport !== '스포츠' &&
      this.state.area !== '지역' &&
      this.state.type !== '타입' &&
      this.state.level !== '실력'
    ) {
      try {
        this.writeChatRoomAdd(
          makeUser,
          joinUser,
          chatList,
          moment().format(),
          this.state.sport,
          this.state.area,
          this.state.type,
          this.state.date,
          this.state.level,
          this.state.memo,
          '배틀신청중',
          battleResult,
          endUser,
          openBox,
          requestUser,
        );
        const resetAction = NavigationActions.navigate({
          routeName: 'SportsBattle',
          // routeName: 'Tabs',
          // action: NavigationActions.navigate({
          //   routeName: '스포츠배틀',
          //   params: {
          //     check: true,
          //   },
          // }),
        });
        Alert.alert(
          '배틀등록 완료',
          '나의 배틀 페이지에서 확인할 수 있습니다!',
        );
        this.props.navigation.dispatch(resetAction);
      } catch (error) {
        console.log('update Battle error ::: ' + error);
      } finally {
        this.setState({
          error,
        });
        console.log(
          this.state.sport,
          this.state.area,
          this.state.type,
          this.state.date,
          this.state.level,
          this.state.memo,
        );
      }
    } else {
      // Alert.alert('선택 설정을 완료해주세요.');
      this.refs.toast.show('선택 설정을 완료해주세요.');
    }
    return;
  };

  render() {
    const {loading, insertBattle, date} = this.state;
    return (
      <>
        <BattlePresenter
          loading={loading}
          insertBattle={insertBattle}
          date={date}
          setSportChange={this.setSportChange}
          setAreaChange={this.setAreaChange}
          setTypeChange={this.setTypeChange}
          setDateChange={this.setDateChange}
          setLevelChange={this.setLevelChange}
          setMemoChange={this.setMemoChange}
          updateBattle={this.updateBattle}
        />
        <Toast
          ref="toast"
          style={{backgroundColor: '#fee6d0'}}
          position="bottom"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={2000}
          opacity={1}
          textStyle={{color: '#000000'}}
        />
      </>
    );
  }
}
