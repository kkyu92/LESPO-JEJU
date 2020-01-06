import React from 'react';
import styled from 'styled-components';
import {Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import KoreanFood from '../taps/FoodTab/KFood/KFoodContainer';
import ChineseFood from '../taps/FoodTab/CFood/CFoodContainer';
import WesternFood from '../taps/FoodTab/WFood/WFoodContainer';
import JapaneseFood from '../taps/FoodTab/JFood/JFoodContainer';
import JejuFood from '../taps/FoodTab/JejuFood/JejuFoodContainer';

import {BG_COLOR} from '../constants/Colors';
import {createStack, createTap} from './config';

const Icon = styled.Image`
  /* width: 30px;
  height: 29px; */
`;

// const Icon10 = styled.

const FoodNavigation = createMaterialTopTabNavigator(
  {
    // Tab Nav 개별설정
    한식: {
      screen: createTap(KoreanFood),
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
    중식: {
      screen: createTap(ChineseFood),
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
    양식: {
      screen: createTap(WesternFood),
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
    일식: {
      screen: createTap(JapaneseFood),
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
    제주전통: {
      screen: createTap(JejuFood),
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
      showLabel: true,
      labelStyle: {
        fontSize: 14,
        fontWeight: '600',
        alignItems: 'center',
        justifyContent: 'center',
      },
      showIcon: true,
      iconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabStyle: {
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

export default createAppContainer(FoodNavigation);
