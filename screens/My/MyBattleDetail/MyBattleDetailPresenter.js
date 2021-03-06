import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {
  BG_COLOR,
  TINT_COLOR,
  BLACK_COLOR,
  GREY_COLOR2,
  GREY_COLOR,
  RED_COLOR,
} from '../../../constants/Colors';
import {Platform} from 'react-native';
import Section from '../../../components/Section';
import SearchNo from '../../Main/Search/SearchNo';
import BattleSlide from '../../../components/BattleSlide';
import Ionicons from 'react-native-vector-icons/Ionicons';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-top: 10;
  padding-bottom: 20;
  margin-top: 20;
  flex: 1;
`;

const BattleContainer = styled.View`
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 20px;
  margin-right: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* border-radius: 5px;
  border-width: 1px;
  border-color: burlywood; */
`;

const BattleContainerList = styled.View`
  width: 70%;
  flex-direction: column;
`;

const BattleList = styled.View`
  flex-direction: row;
`;

const TopContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 20px;
`;

const LevelText = styled.Text`
  border-color: ${GREY_COLOR2};
  border-radius: 10px;
  border-width: 1px;
  text-align: center;
  padding: 8px;
  margin-left: 20px;
  margin-right: 20px;
`;

const TopText = styled.Text`
  color: ${BLACK_COLOR};
  font-size: 25px;
  font-weight: 800;
`;

const Touchable = styled.TouchableOpacity``;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const UserContainer = styled.View`
  width: 40%;
  align-items: center;
  justify-content: center;
  /* background-color: royalblue; */
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

const NameText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const VsText = styled.Text`
  font-size: 25px;
  font-weight: 400;
`;

const MidText = styled.Text`
  color: ${BLACK_COLOR};
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 10px;
`;

const TitleText = styled.Text`
  width: 30%;
  color: ${BG_COLOR};
  font-size: 14px;
  font-weight: 800;
  margin-top: ${Platform.OS === 'ios' ? '6px' : '5px'};
  margin-bottom: ${Platform.OS === 'ios' ? '6px' : '5px'};
  text-align: center;
`;

const GetText = styled.Text`
  width: 70%;
  font-size: 14px;
  color: #333333;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const Btn = styled.TouchableOpacity`
  background-color: ${BG_COLOR};
  border-radius: 10px;
  width: 80%;
  align-items: center;
  align-self: center;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 40px;
  padding: 20px;
`;

const BtnText = styled.Text`
  font-size: 20px;
  color: ${TINT_COLOR};
`;

const Status = styled.View`
  width: 30%;
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${BG_COLOR};
  padding: 5px;
  margin-left: 5px;
`;

const StatusText = styled.Text`
  color: ${BG_COLOR};
`;

const StatusRequest = styled.View`
  width: 30%;
  justify-content: center;
  align-items: center;
  border-radius: 5;
  border-width: 1;
  border-color: ${RED_COLOR};
  padding: 5px;
  margin-left: 5px;
`;

const StatusTextRequest = styled.Text`
  color: ${RED_COLOR};
  text-align: center;
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
  margin-left: 5px;
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
  margin-left: 5px;
`;

const StatusTextEnd = styled.Text`
  color: ${GREY_COLOR2};
`;

const BattleTalkBtn = styled.TouchableOpacity`
  border-radius: 10px;
  border-width: 1px;
  border-color: ${BG_COLOR};
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const BattleTalkTxt = styled.Text`
  color: ${BG_COLOR};
`;

const MyBattleDetailPresenter = ({
  loading,
  sport,
  type,
  date,
  area,
  memo,
  statusText,
  level,
  requestUser,
  chatRoomList,
  myId,
  myName,
  myProfile,
  id,
  name,
  profile,
  roomKey,
  roomMaker,
  endCheck,
  endUser1,
  endUser2,
  openBox,
  battleResult,
  changeModalVisiblity,
  setData,
  outCheck,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <Container>
        <TopContainer>
          <TopText>{statusText}</TopText>
          {name !== '' && name !== null ? (
            <>
              <LevelText>{level}</LevelText>
              {statusText === '배틀종료' ? null : (
                <BattleTalkBtn
                  onPress={() =>
                    navigation.navigate({
                      routeName: 'BattleTalk',
                      params: {
                        roomKey,
                        id,
                        profile,
                        name,
                        outCheck: outCheck,
                      },
                    })
                  }>
                  <BattleTalkTxt>배틀톡</BattleTalkTxt>
                </BattleTalkBtn>
              )}
            </>
          ) : (
            <LevelText>{level}</LevelText>
          )}
        </TopContainer>

        <ProfileContainer>
          {name === '' || name === null ? (
            <UserContainer>
              {profile ? (
                <ProfileImg source={{uri: profile}} />
              ) : (
                <NullImg
                  source={require(`../../../assets/drawable-xxhdpi/icon_profile.png`)}
                />
              )}
              <NameText>{'대기중입니다...'}</NameText>
            </UserContainer>
          ) : (
            <UserContainer>
              {profile ? (
                <ProfileImg source={{uri: profile}} />
              ) : (
                <NullImg
                  source={require(`../../../assets/drawable-xxhdpi/icon_profile.png`)}
                />
              )}
              <NameText>{name}</NameText>
            </UserContainer>
          )}

          <VsText>VS</VsText>

          <UserContainer>
            {myProfile ? (
              <ProfileImg source={{uri: myProfile}} />
            ) : (
              <NullImg
                source={require(`../../../assets/drawable-xxhdpi/icon_profile.png`)}
              />
            )}
            <NameText>{myName}</NameText>
          </UserContainer>
        </ProfileContainer>

        <MidText>배틀 신청 내용</MidText>
        <BattleContainer>
          <BattleContainerList>
            <BattleList>
              <TitleText>배틀종목</TitleText>
              <GetText>{sport}</GetText>
            </BattleList>
            <BattleList>
              <TitleText>매칭형태</TitleText>
              <GetText>{type}</GetText>
            </BattleList>
            <BattleList>
              <TitleText>배틀날짜</TitleText>
              <GetText>{date}</GetText>
            </BattleList>
            <BattleList>
              <TitleText>배틀지역</TitleText>
              <GetText>{area}</GetText>
            </BattleList>
            <BattleList>
              <TitleText>메 모</TitleText>
              <GetText numberOfLines={5}>{memo}</GetText>
            </BattleList>
          </BattleContainerList>

          {statusText === '배틀신청중' ? (
            <Status>
              <StatusText>{statusText}</StatusText>
            </Status>
          ) : statusText === '배틀요청' ? (
            <StatusRequest>
              {requestUser === JSON.stringify(myId) ? (
                <StatusTextRequest>배틀요청{'\n'}대기중</StatusTextRequest>
              ) : (
                <StatusTextRequest>{statusText}</StatusTextRequest>
              )}
            </StatusRequest>
          ) : statusText === '배틀진행중' ? (
            <StatusIng>
              <StatusTextIng>{statusText}</StatusTextIng>
            </StatusIng>
          ) : (
            <StatusEnd>
              <StatusTextEnd>{statusText}</StatusTextEnd>
            </StatusEnd>
          )}
        </BattleContainer>

        {statusText === '배틀신청중' ? (
          <Btn onPress={() => changeModalVisiblity(true)}>
            <BtnText>배틀취소</BtnText>
          </Btn>
        ) : statusText === '배틀요청' ? (
          requestUser === JSON.stringify(myId) ? (
            <Btn>
              <BtnText>배틀요청을 대기중입니다.</BtnText>
            </Btn>
          ) : (
            <Btn onPress={() => changeModalVisiblity(true)}>
              <BtnText>배틀요청 수락하기</BtnText>
            </Btn>
          )
        ) : statusText === '배틀진행중' ? (
          <Btn onPress={() => changeModalVisiblity(true)}>
            <BtnText>배틀종료 및 평가하기</BtnText>
          </Btn>
        ) : endCheck !== myId ? (
          <Btn onPress={() => changeModalVisiblity(true)}>
            <BtnText>평가하기</BtnText>
          </Btn>
        ) : endUser1 === myId && endUser2 !== myId && openBox === 'false' ? (
          <Btn onPress={() => setData('reCheck', '', battleResult)}>
            <BtnText>다시 평가하기</BtnText>
          </Btn>
        ) : (
          <Btn>
            <BtnText>종료된 배틀입니다</BtnText>
          </Btn>
        )}
      </Container>
    </View>
  );

export default withNavigation(MyBattleDetailPresenter);
