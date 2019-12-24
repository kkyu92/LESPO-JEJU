import React from "react";
import styled from "styled-components";
import {
  TINT_COLOR,
  GREY_COLOR,
  BG_COLOR,
  BLACK_COLOR
} from "../constants/Colors";

const Vote = styled.Text`
  color: ${props => (props.inSlide ? TINT_COLOR : BG_COLOR)};
  font-size: ${props => (props.inSlide ? "16px" : "16px")};
  font-weight: 600;
  align-items: center;
`;

const LiekImg = styled.Image`
  height: ${props => (props.inSlide ? "20px" : "15px")};
  width: ${props => (props.inSlide ? "20px" : "15px")};
  align-items: center;
`;

const Text = styled.Text`
  align-items: center;
`;

const Like = ({ votes, inSlide = false }) =>
  inSlide ? (
    <Vote inSlide={inSlide}>
      <LiekImg source={require(`../assets/drawable-xxhdpi/icon_like_wh.png`)} />{" "}
      <Text>{`${votes}`}</Text>
    </Vote>
  ) : (
    <Vote inSlide={inSlide}>
      <LiekImg source={require(`../assets/drawable-xxhdpi/icon_like_or.png`)} />{" "}
      <Text>{`${votes}`}</Text>
    </Vote>
  );

export default Like;
