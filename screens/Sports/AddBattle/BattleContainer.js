import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import BattlePresenter from './BattlePresenter';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';
import {NavigationActions} from 'react-navigation';

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
    // let : 변할 수 있는 변수
    let insertBattle, error;
    try {
      this.getData();
      // 배틀 리스트 불러오기
      //   ({
      //     data: { results: insertBattle }
      //   } = await tv.getPopular());
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
      userId: this.state.myId,
      userName: this.state.myName,
      userProfile: this.state.myProfile ? this.state.myProfile : '',
      userRating: 5,
    };
    let joinUser = {
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
        );
        const resetAction = NavigationActions.navigate({
          routeName: 'Tabs',
          action: NavigationActions.navigate({
            routeName: '스포츠배틀',
            params: {
              check: true,
            },
          }),
        });
        Alert.alert(
          '배틀등록 완료',
          '나의 배틀 페이지에서 확인할 수 있습니다!',
        );
        this.props.navigation.dispatch(resetAction);
        // this.state.navigation.dispatch({
        //   routeName: 'Tabs',
        // });
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
      Alert.alert('선택 설정을 완료해주세요.');
    }
    return;
  };

  render() {
    const {loading, insertBattle, date} = this.state;
    return (
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
    );
  }
}
