import React from "react";
import AddPresenter from "./AddPresenter";

export default class extends React.Component {
  state = {
    loading: true,
    error: null
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
        error
      });
    }
  }

  render() {
    const { loading } = this.state;
    return <AddPresenter loading={loading} />;
  }
}
