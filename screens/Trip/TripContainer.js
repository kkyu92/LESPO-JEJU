import React from "react";
import TripPresenter from "./TripPresenter";

export default class extends React.Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    try {
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    const { loading } = this.state;
    return <TripPresenter loading={loading} />;
  }
}
