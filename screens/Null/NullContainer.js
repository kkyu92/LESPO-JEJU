import React from 'react';
import NullPresenter from './NullPresenter';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const {loading} = this.state;
    return <NullPresenter loading={loading} />;
  }
}
