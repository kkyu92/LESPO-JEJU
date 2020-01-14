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
import PhotoUri from '../api/PhotoUri';
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

const BattleContainer = styled.TouchableOpacity`
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
  justify-content: center;
  align-items: center;
  width: 25%;
  /* background-color: red; */
`;

const BattleTitleConatiner = styled.View`
  width: 20%;
  justify-content: center;
  align-items: center;
  /* background-color: green; */
`;

const BattleTextContainer = styled.View`
  width: 43%;
  /* background-color: royalblue; */
`;
const BattleIconContainer = styled.View`
  width: 12%;
  justify-content: center;
  align-items: center;
  /* background-color: purple; */
`;

const TitleText = styled.Text`
  color: ${BG_COLOR};
  font-size: 14px;
  font-weight: 800;
  margin-top: ${Platform.OS === 'ios' ? '6px' : '5px'};
  margin-bottom: ${Platform.OS === 'ios' ? '6px' : '5px'};
`;

const GetText = styled.Text`
  font-size: 14px;
  color: #333333;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const ProfileImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40;
  margin-top: 5px;
`;

const ProfileName = styled.Text`
  color: ${BLACK_COLOR};
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  margin: 4px;
`;

const ProfileLevel = styled.Text`
  border-color: ${GREY_COLOR2};
  border-width: 1;
  font-weight: 400;
  font-size: 14px;
  padding-left: 8px;
  padding-right: 8px;
  text-align: center;
  margin-bottom: 5px;
`;

const CoinText = styled.Text`
  color: ${BG_COLOR};
  font-size: 14px;
`;

const Status = styled.View`
  width: 30%;
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${BG_COLOR};
  padding: 5px;
  margin-left: 10px;
`;

const StatusText = styled.Text`
  color: ${BG_COLOR};
`;

const StatusIng = styled.View`
  width: 30%;
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${BG_COLOR};
  background-color: ${BG_COLOR};
  padding: 5px;
  margin-left: 10px;
`;

const StatusTextIng = styled.Text`
  color: ${TINT_COLOR};
`;
const StatusEnd = styled.View`
  width: 30%;
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${GREY_COLOR2};
  background-color: ${GREY_COLOR};
  padding: 5px;
  margin-left: 10px;
`;

const StatusTextEnd = styled.Text`
  color: ${GREY_COLOR2};
`;

// 별점 표시
ratingCompleted = rating => {
  console.log('Rating is: ' + rating);
};

// 리스트 기본틀
const BattleSlide = ({
  key,
  myBattleList,
  statusText,
  id,
  profile,
  name,
  level,
  rate,
  sport,
  type,
  date,
  area,
  memo,
  coinList,
  navigation,
}) =>
  statusText === '배틀신청중' ? (
    // 나의 배틀 리스트
    <BattleContainer>
      <BattleTitleConatiner>
        <TitleText>배틀종목</TitleText>
        <TitleText>매칭형태</TitleText>
        <TitleText>배틀날짜</TitleText>
        <TitleText>배틀지역</TitleText>
        <TitleText>메 모</TitleText>
      </BattleTitleConatiner>

      <BattleTextContainer>
        <GetText>{sport}</GetText>
        <GetText>{type}</GetText>
        <GetText>{date}</GetText>
        <GetText>{area}</GetText>
        <GetText numberOfLines={1}>{memo}</GetText>
      </BattleTextContainer>

      <Status>
        <StatusText>{statusText}</StatusText>
      </Status>
    </BattleContainer>
  ) : statusText === '배틀진행중' ? (
    // 나의 배틀 리스트
    <BattleContainer>
      <BattleTitleConatiner>
        <TitleText>배틀종목</TitleText>
        <TitleText>매칭형태</TitleText>
        <TitleText>배틀날짜</TitleText>
        <TitleText>배틀지역</TitleText>
        <TitleText>메 모</TitleText>
      </BattleTitleConatiner>

      <BattleTextContainer>
        <GetText>{sport}</GetText>
        <GetText>{type}</GetText>
        <GetText>{date}</GetText>
        <GetText>{area}</GetText>
        <GetText numberOfLines={1}>{memo}</GetText>
      </BattleTextContainer>

      <StatusIng>
        <StatusTextIng>{statusText}</StatusTextIng>
      </StatusIng>
    </BattleContainer>
  ) : statusText === '배틀종료' ? (
    // 나의 배틀 리스트
    <BattleContainer>
      <BattleTitleConatiner>
        <TitleText>배틀종목</TitleText>
        <TitleText>매칭형태</TitleText>
        <TitleText>배틀날짜</TitleText>
        <TitleText>배틀지역</TitleText>
        <TitleText>메 모</TitleText>
      </BattleTitleConatiner>

      <BattleTextContainer>
        <GetText>{sport}</GetText>
        <GetText>{type}</GetText>
        <GetText>{date}</GetText>
        <GetText>{area}</GetText>
        <GetText numberOfLines={1}>{memo}</GetText>
      </BattleTextContainer>

      <StatusEnd>
        <StatusTextEnd>{statusText}</StatusTextEnd>
      </StatusEnd>
    </BattleContainer>
  ) : (
    // 스포츠배틀 리스트
    <BattleContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'BattleTalk',
          // routeName: 'Chat',
          params: {
            id,
            profile,
            name,
          },
        })
      }>
      <BattleProfileContainer>
        <ProfileImg
          source={
            profile
              ? {uri: profile}
              : require(`../assets/drawable-xxhdpi/icon_profile.png`)
          }
        />
        <ProfileName>{name}</ProfileName>
        <ProfileLevel>{level}</ProfileLevel>
        {/* <AirbnbRating
        count={5}
        defaultRating={2.5}
        size={15}
        showRating={false}
        isDisabled={true}
      /> */}
        <Rating startingValue={rate} ratingCount={5} imageSize={15} readonly />
      </BattleProfileContainer>

      <BattleTitleConatiner>
        <TitleText>배틀종목</TitleText>
        <TitleText>매칭형태</TitleText>
        <TitleText>배틀날짜</TitleText>
        <TitleText>배틀지역</TitleText>
        <TitleText>메 모</TitleText>
      </BattleTitleConatiner>

      <BattleTextContainer>
        <GetText>{sport}</GetText>
        <GetText>{type}</GetText>
        <GetText>{date}</GetText>
        <GetText>{area}</GetText>
        <GetText numberOfLines={1}>{memo}</GetText>
      </BattleTextContainer>

      <BattleIconContainer>
        {coinList ? (
          <CoinText>1 Coin</CoinText>
        ) : (
          <Ionicons
            size={30}
            name={Platform.OS === 'ios' ? 'ios-send' : 'md-send'}
            color={`${BG_COLOR}`}
          />
        )}
      </BattleIconContainer>
    </BattleContainer>
  );

export default withNavigation(BattleSlide);
