import React from 'react';
import {Platform} from 'react-native';
import SportsPresenter from './SportsPresenter';
import {tv, movie} from '../../api/Api';
import firebase from 'firebase';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    loading: true,
    listName: null,
    listChanged: null,
    chatRoomList: [],
    error: null,
  };

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyA1YDEatBC9m11UqOGyrzV6AJXwJDff1fI',
        authDomain: 'lespo-261906.firebaseapp.com',
        databaseURL: 'https://lespo-261906.firebaseio.com',
        projectId: 'lespo-261906',
        storageBucket: 'lespo-261906.appspot.com',
        messagingSenderId: '21064185745',
        appId: '1:21064185745:web:71e6c40dc7f8f3bce00c30',
        measurementId: 'G-YSN50WBZB9',
      });
    }
  };

  // Read Data [ once / on = 변화가 있다면 ]
  readUserData() {
    firebase
      .database()
      .ref('UsersList/')
      .on('value', function(snapshot) {
        console.log('readUserData: ' + JSON.stringify(snapshot.val()));
      });
  }

  // get ChatRoomList
  listenForChatRoomList() {
    // var list = [];
    // firebase
    //   .database()
    //   .ref('chatRoomList/')
    //   .on('value', function(dataSnapshot) {
    //     // var list = [];
    //     dataSnapshot.forEach(child => {
    //       list.push({
    //         key: child.key,
    //         makeUser: child.val().makeUser,
    //         joinUser: child.val().joinUser,
    //         chatList: child.val().chatList,
    //         date: child.val().date,
    //         sports: child.val().sports,
    //         area: child.val().area,
    //         battleStyle: child.val().battleStyle,
    //         battleDate: child.val().battleDate,
    //         level: child.val().level,
    //         memo: child.val().memo,
    //         battleState: child.val().battleState,
    //         battleResult: child.val().battleResult,
    //       });
    //     });
    //     // console.log('chatList Data: ' + JSON.stringify(chatRoomList));
    //   });
    // this.setState({
    //   chatRoomList: list,
    // });
    // console.log('chatList Data: ' + JSON.stringify(this.state.chatRoomList));
  }

  // 시작시 불러옴
  async componentWillMount() {
    //async componentDidMount() {
    var self = this;
    self.init();
    let listChanged, error;
    try {
      var list = [];
      firebase
        .database()
        .ref('chatRoomList/')
        .on('value', function(dataSnapshot) {
          // var list = [];
          dataSnapshot.forEach(child => {
            list.push({
              key: child.key,
              makeUser: child.val().makeUser,
              joinUser: child.val().joinUser,
              chatList: child.val().chatList,
              date: child.val().date,
              sports: child.val().sports,
              area: child.val().area,
              battleStyle: child.val().battleStyle,
              battleDate: child.val().battleDate,
              level: child.val().level,
              memo: child.val().memo,
              battleState: child.val().battleState,
              battleResult: child.val().battleResult,
            });
          });
          // console.log('chatList Data: ' + JSON.stringify(chatRoomList));
        });
    } catch (error) {
      console.log(error);
      error = "Cnat't get TV";
    } finally {
      this.setState({
        loading: false,
        listChanged,
        chatRoomList: list,
        error,
      });
      console.log('chatList Data: ' + JSON.stringify(this.state.chatRoomList));
    }
    // 화면 돌아왔을 때 reload !
    // this.subs = [
    //   this.props.navigation.addListener('willFocus', () => {
    //     console.log('willFocus ::: reload');
    //     // this.onListChanging();
    //     this.setState({
    //       chatRoomList: [],
    //     });
    //   }),
    // ];
  }

  // 나갔을때
  componentWillUnmount() {
    console.log('componentWillUnmount ::: ');
    // firebase
    //   .database()
    //   .ref()
    //   .off();
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
    const {loading, listName, listChanged, chatRoomList} = this.state;
    return (
      <SportsPresenter
        loading={loading}
        listName={listName}
        listChanged={listChanged}
        chatRoomList={chatRoomList}
        onListChanging={this.onListChanging}
        handleListUpdate={this.handleListUpdate}
      />
    );
  }
}
