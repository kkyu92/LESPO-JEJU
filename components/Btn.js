import React from "react";
import styled from "styled-components";
import { TINT_COLOR } from "../constants/Colors";

const BtnContainer = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 5px;
  border-radius: 5;
`;

const BtnText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 12px;
`;

const Btn = ({ text }) => (
  <BtnContainer>
    <BtnText>{`${text}`}</BtnText>
  </BtnContainer>
);

export default Btn;
