import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { ACTIVE_COLOR, INACTIVE_COLOR } from "../constants/Colors";

const TabBarHeaderIcons = ({ name, focused }) => (
  <Ionicons
    size={26}
    name={name}
    color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
  />
);

TabBarHeaderIcons.propTypes = {
  name: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired
};

export default TabBarHeaderIcons;
