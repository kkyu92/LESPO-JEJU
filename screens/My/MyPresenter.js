import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import Loader from "../../components/Loader";

// show DATA
const MyPresenter = ({ loading }) => (loading ? <Loader /> : <Text>MY</Text>);

MyPresenter.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default MyPresenter;
