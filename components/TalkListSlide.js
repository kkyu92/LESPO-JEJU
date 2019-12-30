import React from 'react';
import styled from 'styled-components';
import {withNavigation} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';
import {
  BG_COLOR,
  TINT_COLOR,
  GREY_COLOR,
  BLACK_COLOR,
  GREY_COLOR2,
} from '../constants/Colors';
import PhotoUri from '../api/PhotoUri';
import Layout from '../constants/Layout';

const BattleTalkContainer = styled.TouchableOpacity`
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  border-color: ${GREY_COLOR};
  border-bottom-width: 0.5;
  align-items: center;
  justify-content: center;
`;

const BattleProfileContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 75%;
  align-items: center;
  /* background-color: red; */
`;

const BattleTalkNameConatiner = styled.View`
  width: 80%;
  justify-content: center;
  /* align-items: center; */
  /* background-color: green; */
`;

const BattleTalkDateContainer = styled.View`
  width: 20%;
  align-items: flex-end;
  justify-content: center;
  /* background-color: royalblue; */
`;

const NameText = styled.Text`
  font-size: 20px;
  font-weight: 800;
  margin-top: ${Platform.OS === 'ios' ? '12px' : '10px'};
  margin-bottom: ${Platform.OS === 'ios' ? '3px' : '2px'};
`;

const MsgText = styled.Text`
  font-size: 15px;
  color: ${GREY_COLOR2};
  margin-top: ${Platform.OS === 'ios' ? '3px' : '2px'};
  margin-bottom: ${Platform.OS === 'ios' ? '12px' : '10px'};
`;

const DateText = styled.Text`
  font-size: 14px;
  color: ${GREY_COLOR};
`;

const ProfileImg = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30;
  margin-right: 10px;
`;

// 리스트 기본틀
const TalkListSlide = ({id, profile, name, msg, date, time}) => (
  // 나의 배틀톡 리스트
  <BattleTalkContainer>
    <BattleProfileContainer>
      <ProfileImg source={{uri: PhotoUri(profile)}} />
      <BattleTalkNameConatiner>
        <NameText>{name}</NameText>
        <MsgText numberOfLines={1}>{msg}</MsgText>
      </BattleTalkNameConatiner>
    </BattleProfileContainer>

    <BattleTalkDateContainer>
      <DateText>{date}</DateText>
      <DateText>{time}</DateText>
    </BattleTalkDateContainer>
  </BattleTalkContainer>
);

export default withNavigation(TalkListSlide);
