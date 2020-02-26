import React from 'react';
import {Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

// import SportsScreen from '../screens/Sports/SportsContainer';
// import TripScreen from '../screens/Trip/TripContainer';
import EventScreen from '../screens/Add/JejuSound/JejuSoundContainer';
import ShopScreen from '../screens/Add/JejuGift/JejuGiftContainer';
import MainScreen from '../screens/Main/MainContainer';
import MyScreen from '../screens/My/MyContainer';
import AddScreen from '../screens/Add/AddContainer';
import {BG_COLOR, TINT_COLOR} from '../constants/Colors';
import {createStack, createStackMain} from './config';
import styled from 'styled-components';

const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

const TabNavigation = createBottomTabNavigator(
  {
    // Tab Nav 개별설정
    메인: {
      screen: createStackMain(MainScreen),
      navigationOptions: {
        tabBarIcon: ({focused}) =>
          focused ? (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon_home_orange.png`)}
            />
          ) : (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon_home_gray.png`)}
            />
          ),
        // <TabBarIcon
        //   focused={focused}
        //   name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
        // />
        tabBarOptions: {
          activeTintColor: 'orange',
          inactiveTintColor: 'gray',
        },
      },
    },
    이벤트: {
      screen: createStackMain(EventScreen),
      navigationOptions: {
        tabBarIcon: ({focused}) =>
          focused ? (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon-event-or.png`)}
            />
          ) : (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon-event-bk.png`)}
            />
          ),
        tabBarOptions: {
          activeTintColor: 'orange',
          inactiveTintColor: 'gray',
        },
      },
    },
    쇼핑: {
      screen: createStackMain(ShopScreen),
      navigationOptions: {
        tabBarIcon: ({focused}) =>
          focused ? (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon-shopping-or.png`)}
            />
          ) : (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon-shopping-bk.png`)}
            />
          ),
        tabBarOptions: {
          activeTintColor: 'orange',
          inactiveTintColor: 'gray',
        },
      },
    },
    내정보: {
      screen: createStackMain(MyScreen),
      navigationOptions: {
        tabBarIcon: ({focused}) =>
          focused ? (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon_user_orange.png`)}
            />
          ) : (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon_user_gray.png`)}
            />
          ),
        tabBarOptions: {
          activeTintColor: 'orange',
          inactiveTintColor: 'gray',
        },
      },
    },
    더보기: {
      screen: createStackMain(AddScreen),
      navigationOptions: {
        tabBarIcon: ({focused}) =>
          focused ? (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon_more_orange.png`)}
            />
          ) : (
            <Icon
              source={require(`../assets/drawable-xxhdpi/icon_more_gray.png`)}
            />
          ),
        // <Icon source={require(`../assets/drawable-xxxhdpi/icon_more.png`)} />
        tabBarOptions: {
          activeTintColor: 'orange',
          inactiveTintColor: 'gray',
        },
      },
    },
  },
  {
    // Tab Nav 모든설정
    tabBarOptions: {
      //   showLabel: false,
      style: {
        backgroundColor: TINT_COLOR,
        // inactiveBackgroundColor: BG_COLOR,
        // activeBackgroundColor: ACTIVE_COLOR
      },
    },
    // 초기화면 지정
    initialRouteName: '메인',
  },
);

export default createAppContainer(TabNavigation);
