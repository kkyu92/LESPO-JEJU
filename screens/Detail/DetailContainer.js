import React from "react";
import PropTypes from "prop-types";
import DetailPresenter from "./DetailPresenter";

export default class extends React.Component {
  static navigationOptions = () => {
    // return {
    //   title: navigation.getParam("title")
    // };
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: { id, backgroundPoster, title, avg, overview }
        }
      }
    } = props;
    this.state = {
      id,
      backgroundPoster,
      title,
      avg,
      overview
    };
  }

  render() {
    const { id, backgroundPoster, title, avg, overview } = this.state;
    return (
      <DetailPresenter
        id={id}
        backgroundPoster={backgroundPoster}
        title={title}
        avg={avg}
        overview={overview}
      />
    );
  }
}
