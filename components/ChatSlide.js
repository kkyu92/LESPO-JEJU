import React from 'react';
import styled from 'styled-components';
import {withNavigation} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {
  BG_COLOR,
  TINT_COLOR,
  GREY_COLOR,
  BLACK_COLOR,
  GREY_COLOR2,
} from '../constants/Colors';
import Layout from '../constants/Layout';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${TINT_COLOR};
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 5px;
`;
const RightContainer = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${TINT_COLOR};
  align-items: flex-end;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

const ImgContainer = styled.View`
  width: 50px;
  height: 30px;
  justify-content: flex-start;
`;
const Img = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  align-self: flex-start;
`;

const TextContainer = styled.View`
  align-items: flex-start;
  align-self: flex-end;
`;
const RightTextContainer = styled.View`
  align-items: flex-end;
`;

const MsgText = styled.Text`
  margin-left: 5px;
  margin-right: 5px;
  max-width: 50%;
  padding: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${BG_COLOR};
  color: ${BG_COLOR};
  text-align: left;
  align-self: flex-end;
`;
const MsgContainer = styled.View`
  margin-left: 5px;
  margin-right: 5px;
  max-width: 50%;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${BG_COLOR};
  background-color: ${BG_COLOR};
  align-self: center;
`;
const RightMsgText = styled.Text`
  padding: 10px;
  color: ${TINT_COLOR};
  text-align: left;
  align-self: center;
`;
const DateText = styled.Text`
  color: ${GREY_COLOR2};
  font-size: 12px;
`;
const ReadText = styled.Text`
  color: ${BG_COLOR};
  font-size: 10px;
`;

// 체팅 리스트 아이템
const ChatSlide = ({
  prevDate,
  nextDate,
  prevUser,
  nextUser,
  date,
  msg,
  user,
  reader,
  name,
  profile,
  myName,
  myProfile,
  navigation,
}) =>
  // 내가 보낸 메시지
  myName === user ? (
    <RightContainer>
      <RightTextContainer>
        <ReadText>
          {2 - Object.keys(reader).length === 0
            ? ''
            : 2 - Object.keys(reader).length}
        </ReadText>
        {nextDate === date ? (
          nextUser === user ? (
            <></>
          ) : (
            <DateText>{date}</DateText>
          )
        ) : (
          <DateText>{date}</DateText>
        )}
      </RightTextContainer>
      <MsgContainer>
        <RightMsgText>{msg}</RightMsgText>
      </MsgContainer>
    </RightContainer>
  ) : (
    <Container>
      {prevUser === user ? (
        prevDate === date ? (
          <ImgContainer />
        ) : (
          <Img
            source={
              profile
                ? {uri: profile}
                : require(`../assets/drawable-xxhdpi/icon_profile.png`)
            }
          />
        )
      ) : (
        <Img
          source={
            profile
              ? {uri: profile}
              : require(`../assets/drawable-xxhdpi/icon_profile.png`)
          }
        />
      )}
      <MsgText>{msg}</MsgText>
      <TextContainer>
        <ReadText>
          {2 - Object.keys(reader).length === 0
            ? ''
            : 2 - Object.keys(reader).length}
        </ReadText>
        {nextDate === date ? (
          nextUser === user ? (
            <></>
          ) : (
            <DateText>{date}</DateText>
          )
        ) : (
          <DateText>{date}</DateText>
        )}
      </TextContainer>
    </Container>
  );

export default withNavigation(ChatSlide);
