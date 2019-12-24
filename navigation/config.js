import { createStackNavigator } from "react-navigation-stack";
import { BG_COLOR, TINT_COLOR } from "../constants/Colors";

// header Styles
export const headerStyles = {
  headerStyle: {
    backgroundColor: BG_COLOR,
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    color: TINT_COLOR
  },
  headerTintColor: TINT_COLOR
};

// Detail header Styles
export const detailHeaderStyles = {
  // headerStyle: {
  //   backgroundColor: TINT_COLOR
  // },
  headerTransparent: true,
  headerTitleStyle: {
    color: BG_COLOR
  },
  headerTintColor: BG_COLOR
};

// taps header Styles
export const tapsHeaderStyles = {
  headerStyle: {
    backgroundColor: BG_COLOR,
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    color: TINT_COLOR
  },
  headerTintColor: TINT_COLOR
};

// 함수 ( 받는값 ) => ({ 리턴값 })
export const createStack = (screen, title) =>
  createStackNavigator({
    Screen: {
      screen,
      navigationOptions: {
        title,
        ...headerStyles
      }
    }
  });

// 함수 ( 받는값 ) => ({ 리턴값 })
export const createTap = screen =>
  createStackNavigator({
    Screen: {
      screen,
      navigationOptions: {
        header: null,
        headerBackTitle: null
      }
    }
  });
