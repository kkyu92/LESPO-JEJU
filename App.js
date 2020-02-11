import React from 'react';
import {StatusBar, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import MainNavigation from './navigation/MainNavigation';
import TestNavigation from './navigation/TestNavigation';

//TODO: test
//FIXME: test

export default class App extends React.Component {
  state = {
    loaded: false,
  };

  handleError = errror => console.log(errror);
  handleLoaded = () => this.setState({loaded: true});

  // loadAssets = async () => {
  //   await Font.loadAsync({
  //     ...Ionicons.font,
  //   });
  //   await Asset.loadAsync([require("images/icon.png")]);
  // };

  // componentDidMount() {
  //   setTimeout(() => {
  //     SplashScreen.hide();
  //   }, 3000);
  // }

  render() {
    const {loaded} = this.state;
    Ionicons.loadFont();
    MaterialIcons.loadFont();
    MaterialCommunityIcons.loadFont();
    Octicons.loadFont();
    return (
      // 위에 상태창 색상변경
      <>
        <StatusBar barStyle={'light-content'} />
        <MainNavigation />
        {/* <TestNavigation /> */}
      </>
    );
    // } else {
    // return <Text>AppLoading --------</Text>
    // ;
  }
}
// }
