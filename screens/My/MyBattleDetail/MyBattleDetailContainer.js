import React from 'react';
import {Platform} from 'react-native';
import MyBattleDetailPresenter from './MyBattleDetailPresenter';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';

var M_ID, M_NAME, M_PROFILE;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: {
            roomKey,
            id,
            profile,
            name,
            sport,
            type,
            date,
            area,
            memo,
            statusText,
            level,
          },
        },
      },
    } = props;
    this.state = {
      loading: true,
      roomKey,
      id,
      profile,
      name,
      sport,
      type,
      date,
      area,
      memo,
      statusText,
      level,
      chatRoomList: [],
      myId: '',
      myName: '',
      myProfile: '',
      error: null,
    };
    console.log('room ID :' + JSON.stringify(roomKey));
    console.log('user ID :' + JSON.stringify(id));
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
      } else {
        console.log('Login profile image null');
      }
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

  // 시작시 불러옴
  async componentDidMount() {
    let {chatRoomList} = this.state;
    try {
      this.getData();
      this.setState({
        loading: false,
      });
    } catch (error) {
      console.log(error);
      error = "Cnat't get TV";
    }
  }

  componentWillUnmount() {
    // firebase
    //   .database()
    //   .ref('chatRoomList/')
    //   .off();
  }

  render() {
    const {
      loading,
      sport,
      type,
      date,
      area,
      memo,
      statusText,
      level,
      chatRoomList,
      myId,
      myName,
      myProfile,
      name,
      id,
      profile,
      roomKey,
    } = this.state;
    return (
      <MyBattleDetailPresenter
        loading={loading}
        sport={sport}
        type={type}
        date={date}
        area={area}
        memo={memo}
        statusText={statusText}
        level={level}
        chatRoomList={chatRoomList}
        myId={myId}
        myProfile={myProfile}
        myName={myName}
        id={id}
        profile={profile}
        name={name}
        roomKey={roomKey}
      />
    );
  }
}
