import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { BG_COLOR, TINT_COLOR } from "../constants/Colors";
import styled from "styled-components";

const Container = styled.View`
  flex: 1;
  border-radius: 20;
  background-color: ${TINT_COLOR};
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <ActivityIndicator color={BG_COLOR} />
  </Container>
);

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: TINT_COLOR,
//     flex: 1,
//     justifyContent: "center"
//   }
// });
