import React from 'react';
import styled from 'styled-components';
import {Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Ball from '../taps/SportsTab/Ball';
import Billiards from '../taps/SportsTab/Billiards/BilliardsContainer';
import Bowling from '../taps/SportsTab/Bowling/BowlingContainer';
import Health from '../taps/SportsTab/Health/HealthContainer';
import Yoga from '../taps/SportsTab/Yoga/YogaContainer';
import Fight from '../taps/SportsTab/Fight/FigthContainer';
import Other from '../taps/SportsTab/Other/OtherContainer';

import {BG_COLOR} from '../constants/Colors';
import {createStack, createTap} from './config';
import Layout from '../constants/Layout';

const Icon = styled.Image`
  /* width: 30px;
  height: 29px; */
`;

// const Icon10 = styled.

const SportsNavigation = createMaterialTopTabNavigator(
  {
    // Tab Nav 개별설정
    '축구&농구&야구': {
      screen: createTap(Ball),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            style={{width: 30, height: 30}}
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_koreanfood.png`)}
          />
        ),
      },
    },
    당구: {
      screen: createTap(Billiards),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            style={{width: 30, height: 29}}
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_chinesefood.png`)}
          />
        ),
      },
    },
    볼링: {
      screen: createTap(Bowling),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            style={{width: 30, height: 29}}
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_pizza.png`)}
          />
        ),
      },
    },
    헬스: {
      screen: createTap(Health),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            style={{width: 38, height: 25}}
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_sushi.png`)}
          />
        ),
      },
    },
    '필라테스&요가': {
      screen: createTap(Yoga),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            style={{width: 38, height: 25}}
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_blackpig.png`)}
          />
        ),
      },
    },
    격투: {
      screen: createTap(Fight),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            style={{width: 38, height: 25}}
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_blackpig.png`)}
          />
        ),
      },
    },
    기타: {
      screen: createTap(Other),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            style={{width: 38, height: 25}}
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_blackpig.png`)}
          />
        ),
      },
    },
  },
  {
    // Top Nav 모든설정
    tabBarOptions: {
      scrollEnabled: true,
      showLabel: true,
      labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
      },
      showIcon: true,
      iconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabStyle: {
        width: Layout.width / 3,
        alignItems: 'center',
        justifyContent: 'center',
      },
      indicatorStyle: {
        padding: 2,
        backgroundColor: 'white',
        alignSelf: 'center',
        justifyContent: 'center',
      },
      style: {
        backgroundColor: BG_COLOR,
        // inactiveBackgroundColor: BG_COLOR,
        // activeBackgroundColor: ACTIVE_COLOR
      },
    },
    // 초기화면 지정
    // initialRouteName: "메인"
  },
);

export default createAppContainer(SportsNavigation);
