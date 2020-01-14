import {createStackNavigator} from 'react-navigation-stack';

import LoginScreen from '../Test/LoginScreen';
import ChatScreen from '../screens/Sports/BattleTalk/Chat';
import {createAppContainer} from 'react-navigation';

const AppNavigation = createStackNavigator(
  {
    Login: LoginScreen,
    Chat: ChatScreen,
  },
  {headerMode: 'none'},
);

export default createAppContainer(AppNavigation);
