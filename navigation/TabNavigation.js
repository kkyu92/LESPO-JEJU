import React from 'react';
import {Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import SportsScreen from '../screens/Sports/SportsContainer';
import TripScreen from '../screens/Trip/TripContainer';
import MainScreen from '../screens/Main/MainContainer';
import MyScreen from '../screens/My/MyContainer';
import AddScreen from '../screens/Add/AddContainer';
import {BG_COLOR, TINT_COLOR} from '../constants/Colors';
import TabBarIcon from '../components/TabBarIcons';
import {createStack, createStackMain} from './config';
import styled from 'styled-components';

const Icon = styled.Image`
  width: 20px;
  height: 20px;
  background-color: ${BG_COLOR};
`;

const TabNavigation = createBottomTabNavigator(
  {
    // Tab Nav 개별설정
    메인: {
      screen: createStackMain(MainScreen),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          // <Icon source={require(`../assets/drawable-xxxhdpi/icon_home.png`)} />
          <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
          />
        ),
        tabBarOptions: {
          activeTintColor: 'orange',
          inactiveTintColor: 'gray',
        },
      },
    },
    스포츠배틀: {
      screen: createStackMain(SportsScreen),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-football' : 'md-football'}
          />
        ),
        tabBarOptions: {
          activeTintColor: 'orange',
          inactiveTintColor: 'gray',
        },
      },
    },
    여행하기: {
      screen: createStackMain(TripScreen),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-bus' : 'md-bus'}
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
        tabBarIcon: ({focused}) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
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
        tabBarIcon: ({focused}) => (
          <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-more' : 'ios-more'}
          />
          // <Icon source={require(`../assets/drawable-xxxhdpi/icon_more.png`)} />
        ),
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
