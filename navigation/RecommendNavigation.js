import React from 'react';
import styled from 'styled-components';
import {Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import CourseTap from '../taps/Recommend/CourseList/CourseContainer';
import FoodTap from '../taps/Recommend/FoodList/FoodListContainer';
import ViewTap from '../taps/Recommend/ViewList/ViewListContainer';
import PlayTap from '../taps/Recommend/PlayList/PlayListContainer';

import {BG_COLOR} from '../constants/Colors';
import {createStack, createTap} from './config';

const Icon = styled.Image`
  width: 30px;
  height: 29px;
`;

const RecommendNavigation = createMaterialTopTabNavigator(
  {
    // Tab Nav 개별설정
    추천코스: {
      screen: createTap(CourseTap),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_tripcourse.png`)}
          />
        ),
      },
    },
    먹거리추천: {
      screen: createTap(FoodTap),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_meal.png`)}
          />
        ),
      },
    },
    볼거리추천: {
      screen: createTap(ViewTap),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_viewthing.png`)}
          />
        ),
      },
    },
    놀거리추천: {
      screen: createTap(PlayTap),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_leisure.png`)}
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

export default createAppContainer(RecommendNavigation);
