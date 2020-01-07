import React from 'react';
import styled from 'styled-components';
import {Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Extreme from '../taps/LeisureTab/Extreme/ExtremeContainer';
import WaterPark from '../taps/LeisureTab/WaterPark/WaterParkContainer';
import ThemePark from '../taps/LeisureTab/ThemePark/ThemeParkContainer';
import Fishing from '../taps/LeisureTab/Fishing/FishingContainer';
import Experience from '../taps/LeisureTab/Experience/ExperienceContainer';
import Camping from '../taps/LeisureTab/Camping/CampingContainer';
import Other from '../taps/LeisureTab/Other/OtherContainer';

import {BG_COLOR} from '../constants/Colors';
import {createStack, createTap} from './config';
import Layout from '../constants/Layout';

const Icon = styled.Image`
  width: 40px;
  height: 40px;
`;

// const Icon10 = styled.

const LeisureNavigation = createMaterialTopTabNavigator(
  {
    // Tab Nav 개별설정
    익스트림: {
      screen: createTap(Extreme),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_extreme.png`)}
          />
        ),
      },
    },
    워터파크: {
      screen: createTap(WaterPark),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_waterpark.png`)}
          />
        ),
      },
    },
    테마파크: {
      screen: createTap(ThemePark),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_themepark.png`)}
          />
        ),
      },
    },
    낚시: {
      screen: createTap(Fishing),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_fishing.png`)}
          />
        ),
      },
    },
    체험: {
      screen: createTap(Experience),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_experience.png`)}
          />
        ),
      },
    },
    캠핑: {
      screen: createTap(Camping),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_camping.png`)}
          />
        ),
      },
    },
    기타: {
      screen: createTap(Other),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            focused={focused}
            source={require(`../assets/drawable-xxhdpi/icon_leisure_other.png`)}
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
        width: Layout.width / 4,
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

export default createAppContainer(LeisureNavigation);
