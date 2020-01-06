import React from 'react';
import styled from 'styled-components';
import {Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Famous from '../taps/ViewTab/Famous/FamousContainer';
import Tour from '../taps/ViewTab/Tour/TourContainer';
import Sea from '../taps/ViewTab/Sea/SeaContainer';
import Mountain from '../taps/ViewTab/Mountain/MountainContainer';
import OlleGill from '../taps/ViewTab/OlleGill/OlleGillContainer';
import Other from '../taps/ViewTab/Other/OtherContainer';

import {BG_COLOR} from '../constants/Colors';
import {createStack, createTap} from './config';
import Layout from '../constants/Layout';

const Icon = styled.Image`
  /* width: 30px;
  height: 29px; */
`;

// const Icon10 = styled.

const ViewNavigation = createMaterialTopTabNavigator(
  {
    // Tab Nav 개별설정
    '제주도 유명지': {
      screen: createTap(Famous),
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
    관광시설: {
      screen: createTap(Tour),
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
    바다: {
      screen: createTap(Sea),
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
    올레길: {
      screen: createTap(OlleGill),
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
    '오름&산': {
      screen: createTap(Mountain),
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
        width: Layout.width / 3.6,
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

export default createAppContainer(ViewNavigation);
