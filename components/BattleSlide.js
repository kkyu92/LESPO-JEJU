import React from 'react';
import styled from 'styled-components';
import {withNavigation} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Platform, Alert} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {
  BG_COLOR,
  TINT_COLOR,
  GREY_COLOR,
  BLACK_COLOR,
  GREY_COLOR2,
  RED_COLOR,
} from '../constants/Colors';

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
  width: 70px;
  height: 70px;
  border-radius: 35;
  margin-top: 5px;
`;

const NullImg = styled.Image`
  width: 65px;
  height: 65px;
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

const StatusContainer = styled.View`
  width: 30%;
  justify-content: center;
  align-items: stretch;
  border-radius: 5;
`;

const Status = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${BG_COLOR};
  padding: 5px;
`;

const StatusText = styled.Text`
  color: ${BG_COLOR};
`;

const StatusRequest = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${RED_COLOR};
  padding: 5px;
`;

const StatusTextRequest = styled.Text`
  color: ${RED_COLOR};
  text-align: center;
`;

const StatusIng = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${BG_COLOR};
  background-color: ${BG_COLOR};
  padding: 5px;
`;

const StatusTextIng = styled.Text`
  color: ${TINT_COLOR};
`;
const StatusEnd = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${GREY_COLOR2};
  background-color: ${GREY_COLOR};
  padding: 5px;
`;

const StatusTextEnd = styled.Text`
  color: ${GREY_COLOR2};
`;
const StatusDelete = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${RED_COLOR};
  background-color: ${RED_COLOR};
  padding: 5px;
`;

const StatusTextDelete = styled.Text`
  color: ${TINT_COLOR};
`;

// 별점 표시
ratingCompleted = rating => {
  console.log('Rating is: ' + rating);
};

// 리스트 기본틀
const BattleSlide = ({
  deleteMyBattle,
  requestUser,
  openBox,
  endUser,
  battleResult,
  statusText,
  roomKey,
  myId,
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
  outCheck,
  loadingCheck,
  navigation,
}) =>
  statusText === '배틀신청중' ? (
    // 나의 배틀 리스트
    <BattleContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'MyBattleDetail',
          params: {
            roomKey,
            id,
            profile,
            name,
            sport,
            type,
            date,
            area,
            memo,
            statusText,
            level,
            loadingCheck,
          },
        })
      }>
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

      <StatusContainer>
        <Status>
          <StatusText>{statusText}</StatusText>
        </Status>
      </StatusContainer>
    </BattleContainer>
  ) : statusText === '배틀요청' ? (
    // 나의 배틀 리스트
    <BattleContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'MyBattleDetail',
          params: {
            roomKey,
            id,
            profile,
            name,
            sport,
            type,
            date,
            area,
            memo,
            statusText,
            level,
            requestUser,
            loadingCheck,
          },
        })
      }>
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

      <StatusContainer>
        <StatusRequest>
          {requestUser === myId ? (
            <StatusTextRequest>배틀요청{'\n'}대기중</StatusTextRequest>
          ) : (
            <StatusTextRequest>{statusText}</StatusTextRequest>
          )}
        </StatusRequest>
      </StatusContainer>
    </BattleContainer>
  ) : statusText === '배틀진행중' ? (
    // 나의 배틀 리스트
    <BattleContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'MyBattleDetail',
          params: {
            roomKey,
            id,
            profile,
            name,
            sport,
            type,
            date,
            area,
            memo,
            statusText,
            level,
            loadingCheck,
          },
        })
      }>
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

      <StatusContainer>
        <StatusIng>
          <StatusTextIng>{statusText}</StatusTextIng>
        </StatusIng>
      </StatusContainer>
    </BattleContainer>
  ) : statusText === '배틀종료' ? (
    // 나의 배틀 리스트
    <BattleContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'MyBattleDetail',
          params: {
            roomKey,
            id,
            profile,
            name,
            sport,
            type,
            date,
            area,
            memo,
            statusText,
            battleResult,
            level,
            loadingCheck,
          },
        })
      }>
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

      <StatusContainer>
        <StatusEnd>
          <StatusTextEnd>{statusText}</StatusTextEnd>
        </StatusEnd>
        {battleResult.lose !== '' && battleResult.win !== '' ? (
          battleResult.win === myId &&
          endUser.user1 !== '' &&
          endUser.user2 !== '' &&
          openBox === false ? (
            <Status>
              <StatusText>랜덤박스{'\n'}확인하기</StatusText>
            </Status>
          ) : (
            <>
              <StatusEnd>
                <StatusTextEnd>평가완료</StatusTextEnd>
              </StatusEnd>
              <StatusDelete
                onPress={() =>
                  Alert.alert(
                    '배틀내역 삭제하기',
                    '나의 배틀 내역을 삭제합니다',
                    [
                      {
                        text: '취소',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: '삭제',
                        onPress: () => deleteMyBattle(roomKey, myId, id),
                      },
                    ],
                    {cancelable: false},
                  )
                }>
                <StatusTextDelete>삭제하기</StatusTextDelete>
              </StatusDelete>
            </>
          )
        ) : (battleResult.lose === myId && battleResult.win === '') ||
          (battleResult.lose === '' && battleResult.win === myId) ? (
          <StatusIng>
            <StatusTextIng>평가대기중</StatusTextIng>
          </StatusIng>
        ) : (
          <Status>
            <StatusText>평가하기</StatusText>
          </Status>
        )}
      </StatusContainer>
    </BattleContainer>
  ) : (
    // 스포츠배틀 리스트
    <BattleContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'BattleTalk',
          // routeName: 'Chat',
          params: {
            roomKey,
            id,
            profile,
            name,
            container: 'SportsBattle',
            outCheck: outCheck,
          },
        })
      }>
      <BattleProfileContainer>
        {profile ? (
          <ProfileImg source={{uri: profile}} />
        ) : (
          <NullImg
            source={require(`../assets/drawable-xxhdpi/icon_profile.png`)}
          />
        )}
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
