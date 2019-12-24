import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import {ACTIVE_COLOR, INACTIVE_COLOR} from '../constants/Colors';

const TabBarIcon = ({name, focused}) => (
  <Icon size={26} name={name} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
);

TabBarIcon.propTypes = {
  name: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
};

export default TabBarIcon;
