import React from 'react';
import styled from 'styled-components';
import Loader from '../../components/Loader';
import {
  TINT_COLOR,
  BG_COLOR,
  GREY_COLOR2,
  RED_COLOR,
} from '../../constants/Colors';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import {withNavigation} from 'react-navigation';

const Container = styled.View`
  background-color: #ffffff;
  opacity: 0.5;
  flex: 1;
`;

const NullPresenter = ({loading}) => (loading ? <Container /> : <Loader />);

export default withNavigation(NullPresenter);
