import React from 'react';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {
  BG_COLOR,
  TINT_COLOR,
  GREY_COLOR,
  BLACK_COLOR,
  GREY_COLOR2,
  GREY_COLOR3,
} from '../constants/Colors';
import Layout from '../constants/Layout';
import moment from 'moment';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 10px;
  /* background-color: royalblue; */
`;
const ProfileContainer = styled.View`
  width: 20%;
  align-items: center;
  justify-content: center;
`;
const TextContainer = styled.View`
  width: 65%;
  align-items: flex-start;
  justify-content: center;
`;
const DateContainer = styled.View`
  width: 15%;
  align-items: flex-end;
  justify-content: center;
`;

const Profile = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
const NameText = styled.Text`
  color: black;
  font-size: 15px;
  font-weight: 800;
`;
const CommentText = styled.Text`
  color: ${GREY_COLOR2};
  font-size: 12px;
  font-weight: 600;
`;
const DateText = styled.Text`
  color: ${GREY_COLOR};
  font-size: 10px;
  font-weight: 600;
  align-self: flex-end;
`;

// 체팅 리스트 아이템
const CommentSlide = ({commentId, commentText, userId, userName, time}) => (
  <Container>
    <ProfileContainer>
      <Profile source={require(`../assets/drawable-xxhdpi/icon_profile.png`)} />
    </ProfileContainer>
    <TextContainer>
      <NameText>{userName}</NameText>
      <CommentText>{commentText}</CommentText>
    </TextContainer>
    <DateContainer>
      <DateText>{moment(time).format('MM월 D일 h:mm a')}</DateText>
    </DateContainer>
  </Container>
);
// console.log(commentId, commentText, userId, userName, time);

export default CommentSlide;
