import React from 'react';
import {Modal} from 'react-native';
import MyPresenter from './MyPresenter';
import SimpleDialog from '../../components/SimpleDialog';

export default class extends React.Component {
  // state = {
  //   loading: false,
  // };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isModalVisible: false,
      choosenData: '',
    };
  }

  changeModalVisiblity = bool => {
    this.setState({isModalVisible: bool});
  };

  //TODO: Logout
  setData = data => {
    console.log('setData::: ', data);
    this.setState({choosenData: data});
  };

  render() {
    const {loading} = this.state;
    return (
      <>
        <MyPresenter
          loading={loading}
          changeModalVisiblity={this.changeModalVisiblity}
          setData={this.setData}
        />
        <Modal
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.changeModalVisiblity(false)}
          animationType="fade">
          <SimpleDialog
            changeModalVisiblity={this.changeModalVisiblity}
            setData={this.setData}
          />
        </Modal>
      </>
    );
  }
}
