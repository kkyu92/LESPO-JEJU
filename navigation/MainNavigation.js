import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import TabNavigation from './TabNavigation';
import RecommendNavigation from './RecommendNavigation';
import LoginScreen from '../screens/Login/LoginContainer';
import SignupScreen from '../screens/Signup/SignupContainer';
import SearchScreen from '../screens/Main/Search/SearchContainer';
import DetailScreen from '../screens/Detail/DetailContainer';
import JejuSoundScreen from '../screens/Add/JejuSound/JejuSoundContainer';
import JejuGiftScreen from '../screens/Add/JejuGift/JejuGiftContainer';
import AddBattleScreen from '../screens/Sports/AddBattle/BattleContainer';
import {headerStyles, detailHeaderStyles, tapsHeaderStyles} from './config';

// 최상위 Nav [ Main tap4 + 검색 + 메인리스트 + 위시리스트... ]
const HomeNavigation = createStackNavigator(
  {
    // Login + Signup
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerTitle: '제주배틀투어',
        headerBackTitle: null,
        ...tapsHeaderStyles,
      },
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: {
        headerTitle: '제주배틀투어',
        headerBackTitle: null,
        ...tapsHeaderStyles,
      },
    },
    // 메인 텝 화면
    Tabs: {
      screen: TabNavigation,
      navigationOptions: {
        header: null,
        headerBackTitle: null,
        //TODO: 헤더 좌우로 아이콘 만들기 가능
        // headerLeft: (
        //   <Ionicons
        //     size={30}
        //     name={Platform.OS === "ios" ? "ios-list" : "md-list"}
        //   />
        // )
      },
    },
    // 상세 페이지
    Detail: {
      screen: DetailScreen,
      navigationOptions: {
        ...detailHeaderStyles,
      },
    },
    // 제주의 소리
    JejuSound: {
      screen: JejuSoundScreen,
      navigationOptions: {
        ...headerStyles,
      },
    },
    // 관광상품
    JejuGift: {
      screen: JejuGiftScreen,
      navigationOptions: {
        ...headerStyles,
      },
    },
    // Search
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        ...headerStyles,
      },
    },
    // Add Battle
    InsertBattle: {
      screen: AddBattleScreen,
      navigationOptions: {
        ...headerStyles,
      },
    },
    // 추천관광 텝 화면
    Recommend: {
      screen: RecommendNavigation,
      navigationOptions: {
        ...tapsHeaderStyles,
        headerTitle: '추천관광',
      },
    },
    // 먹거리 텝 화면
    // 볼거리 텝 화면
    // 놀거리 텝 화면
  },
  {
    //TODO: 옆에서 나오는거 할때 사용하면 좋을듯
    // transparentCard: true,

    // 화면전환시 텝 사라질때 어색한부분
    headerMode: 'screen',
    // 텝 벡버튼 보여지는 부분
    // headerBackTitleVisible: false,
    mode: 'card',
  },
);

export default createAppContainer(HomeNavigation);
