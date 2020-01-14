import React from 'react';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  BLACK_COLOR,
  GREY_COLOR,
  GREY_COLOR3,
  GREY_COLOR2,
  TINT_COLOR2,
} from '../constants/Colors';
import Layout from '../constants/Layout';

function ChangeColor() {
  let ColorCode =
    'rgb(' +
    Math.floor(Math.random() * 256) +
    ',' +
    Math.floor(Math.random() * 256) +
    ',' +
    Math.floor(Math.random() * 256) +
    ')';
  return ColorCode;
}

const Container = styled.TouchableOpacity`
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: ${GREY_COLOR};
  border-bottom-width: 0.5;
  align-items: center;
  justify-content: space-between;
`;

const RowContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* background-color: royalblue; */
`;

const TextContainer = styled.View``;

const Title = styled.Text`
  color: ${BLACK_COLOR};
  font-size: 16px;
  font-weight: 800;
`;

const Contents = styled.Text`
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${GREY_COLOR3};
  background-color: ${TINT_COLOR2};
  margin-top: 10px;
  padding: 10px;
  display: flex;
`;

const Date = styled.Text`
  font-size: 14px;
  color: ${GREY_COLOR2};
`;

let state = {
  show: true,
  index: null,
};

// 리스트 기본틀
const Notice = ({
  id,
  title,
  contents,
  date,
  index,
  handleClickIndex,
  navigation,
}) =>
  title ? (
    // 세로로 슬라이드 - TAG [ 여행하기 ]
    <Container onPress={() => handleClickIndex(id)}>
      <RowContainer>
        <TextContainer>
          <Title numberOfLines={1}>{title}</Title>
          <Date>{date}</Date>
        </TextContainer>
        {index === id ? (
          <Icon
            size={Platform.OS === 'ios' ? 25 : 30}
            name={Platform.OS === 'ios' ? 'ios-arrow-up' : 'md-arrow-dropup'}
            color={`${GREY_COLOR2}`}
          />
        ) : (
          <Icon
            size={Platform.OS === 'ios' ? 25 : 30}
            name={
              Platform.OS === 'ios' ? 'ios-arrow-down' : 'md-arrow-dropdown'
            }
            color={`${GREY_COLOR2}`}
          />
        )}
      </RowContainer>
      {index === id ? <Contents>{contents}</Contents> : null}
    </Container>
  ) : (
    console.log('title null')
  );

export default Notice;
