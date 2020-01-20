import React from 'react';
import {Modal} from 'react-native';
import SimpleDialog from '../../components/SimpleDialog';
import MyPresenter from './MyPresenter';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions} from 'react-navigation';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      loading: false,
      isModalVisible: false,
      loginStatus: '',
      name: '',
      profile: '',
      navigation: navigation,
    };
  }

  async componentDidMount() {
    this.getData();
  }

  // 내정보 저장값 불러오기
  getData = async () => {
    console.log('getData');
    try {
      let M_NAME = await AsyncStorage.getItem('@USER_NAME');
      let M_PROFILE = await AsyncStorage.getItem('@USER_PROFILE');
      this.setState({
        name: M_NAME,
        profile: M_PROFILE,
      });
      if (M_PROFILE !== null || M_PROFILE !== '') {
        console.log('프로필 있다.');
      } else {
        console.log('프로필 없다.');
      }
    } catch (e) {
      // error reading value
      console.log('getData ERROR ::: ' + e);
    }
  };

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  //TODO: Logout
  setData = data => {
    console.log('setData::: ', data);
    if (data === 'OK') {
      this.props.navigation.navigate({routeName: 'Login'});
      // const resetAction = NavigationActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({routeName: 'Login'})],
      // });
      // this.props.navigation.dispatch(resetAction);
      // this.props.navigation.dispatch(
      //   NavigationActions.reset({
      //     index: 0,
      //     actions: [NavigationActions.navigate({routeName: 'Login'})],
      //   }),
      // );
    }
    // this.setState({loginStatus: data});
  };

  render() {
    const {loading, name, profile} = this.state;
    return (
      <>
        <MyPresenter
          loading={loading}
          name={name}
          profile={profile}
          changeModalVisiblity={this.changeModalVisiblity}
          setData={this.setData}
        />
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            battleState={null}
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
      </>
    );
  }
}
