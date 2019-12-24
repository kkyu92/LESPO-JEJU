import React from "react";
import MyPresenter from "./MyPresenter";

export default class extends React.Component {
  state = {
    loading: true
  };
  render() {
    const { loading } = this.state;
    return <MyPresenter loading={loading} />;
  }
}
