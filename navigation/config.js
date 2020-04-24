import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {BG_COLOR, TINT_COLOR} from '../constants/Colors';
import {TouchableOpacity} from 'react-native';
import BackBtn from 'react-native-vector-icons/Ionicons';

const Left = ({onPress}) => (
  <TouchableOpacity onPress={() => onPress}>
    <BackBtn
      size={30}
      name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
      color={`${TINT_COLOR}`}
    />
  </TouchableOpacity>
);

// header Styles
export const headerStyles = {
  headerStyle: {
    backgroundColor: BG_COLOR,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: TINT_COLOR,
  },
  headerTintColor: TINT_COLOR,
};

export const dapdapStyles = {
  // headerLeft: ({goBack}) => <Left onPress={goBack} />,
  headerStyle: {
    // padding: 10,
    marginTop: 10,
    // marginBottom: 10,
    marginLeft: 5,
  },
  headerTransparent: true,
  headerTitleStyle: {
    color: BG_COLOR,
  },
  headerTintColor: TINT_COLOR,
};

// Detail header Styles
export const detailHeaderStyles = {
  // headerStyle: {
  //   backgroundColor: TINT_COLOR
  // },
  headerTransparent: true,
  headerTitleStyle: {
    color: BG_COLOR,
  },
  headerTintColor: BG_COLOR,
};

// taps header Styles
export const tapsHeaderStyles = {
  headerStyle: {
    backgroundColor: BG_COLOR,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: TINT_COLOR,
  },
  headerTintColor: TINT_COLOR,
};

// 함수 ( 받는값 ) => ({ 리턴값 })
export const createStack = (screen, title) =>
  createStackNavigator({
    Screen: {
      screen,
      navigationOptions: {
        title,
        ...headerStyles,
      },
    },
  });

export const createStackMain = screen =>
  createStackNavigator({
    Screen: {
      screen,
      navigationOptions: {
        header: null,
      },
    },
  });

// 함수 ( 받는값 ) => ({ 리턴값 })
export const createTap = screen =>
  createStackNavigator({
    Screen: {
      screen,
      navigationOptions: {
        header: null,
        headerBackTitle: null,
      },
    },
  });
