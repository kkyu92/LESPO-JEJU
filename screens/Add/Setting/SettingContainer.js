import React from 'react';
import SettingPresenter from './SettingPresenter';

export default class extends React.Component {
  state = {
    loading: true,
    alarm: true,
    error: null,
  };

  alarmChange = val => {
    // console.log('val: ' + val);
    this.setState({
      alarm: val,
    });
    // console.log('alarm: ' + alarm);
  };

  async componentDidMount() {
    let error;
    try {
    } catch (error) {
      console.log(error);
      error = "Cnat't get MORE API";
    } finally {
      this.setState({
        loading: false,
        error,
      });
    }
  }

  render() {
    const {loading, alarm} = this.state;
    return (
      <SettingPresenter
        loading={loading}
        alarm={alarm}
        alarmChange={this.alarmChange}
      />
    );
  }
}
