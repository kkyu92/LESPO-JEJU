import React from 'react';
import moment from 'moment';
// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BattleTalkPresenter from './BattleTalkPresenter';

var nowDate = moment().format('YYYY-MM-DD');
var M_NAME = '';
var M_PROFILE = '';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: {id, profile, name},
        },
      },
    } = props;
    this.state = {
      id,
      profile,
      name,
      myName: '',
      myProfile: '',
      loading: true,
      insertChatList: null,
      msg: null,
      date: nowDate,
      error: null,
    };
  }

  // setAreaChange = selected => {
  //   console.log('setAreaChange fun ::: ' + selected);
  //   this.setState({
  //     area: selected,
  //   });
  // };
  // setTypeChange = selected => {
  //   console.log('setTypeChange fun ::: ' + selected);
  //   this.setState({
  //     type: selected,
  //   });
  // };
  // setDateChange = selected => {
  //   this.state.date = selected;
  //   this.setState({
  //     date: selected,
  //   });
  //   console.log('setDateChange fun ::: ' + this.state.date);
  //   // this.onDateChanging();
  // };
  // setLevelChange = selected => {
  //   console.log('setLevelChange fun ::: ' + selected);
  //   this.setState({
  //     level: selected,
  //   });
  // };
  // setMemoChange = selected => {
  //   console.log('setMemoChange fun ::: ' + selected);
  //   this.setState({
  //     memo: selected,
  //   });
  // };

  getData = async () => {
    console.log('getData');
    try {
      M_NAME = await AsyncStorage.getItem('@USER_NAME');
      M_PROFILE = await AsyncStorage.getItem('@USER_PROFILE');
      if (M_PROFILE !== null || M_PROFILE !== '') {
        this.setState({
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
    let insertChatList, error;
    try {
      // 내 로그인 정보 불러오기
      this.getData();
      // 채팅 리스트 불러오기
      //   ({
      //     data: { results: insertBattle }
      //   } = await tv.getPopular());
    } catch (error) {
      console.log('insert ChatList api error ::: ' + error);
      error = "Cant't insert ChatList.";
    } finally {
      this.setState({
        loading: false,
        error,
        insertChatList,
      });
    }
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
    try {
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
    return;
  };

  render() {
    const {
      loading,
      insertChatList,
      msg,
      date,
      profile,
      name,
      myName,
      myProfile,
    } = this.state;
    return (
      <BattleTalkPresenter
        loading={loading}
        insertChatList={insertChatList}
        msg={msg}
        date={date}
        // 상대 정보
        profile={profile}
        name={name}
        // 내 정보
        myName={myName}
        myProfile={myProfile}
      />
    );
  }
}
