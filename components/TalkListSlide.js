import React from 'react';
import styled from 'styled-components';
import {withNavigation} from 'react-navigation';
import {Platform, Alert} from 'react-native';
import {
  BG_COLOR,
  GREY_COLOR,
  GREY_COLOR2,
  TINT_COLOR,
} from '../constants/Colors';
import IconDelete from 'react-native-vector-icons/MaterialIcons';

const BattleTalkContainer = styled.TouchableOpacity`
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 10px;
  flex-direction: row;
  border-color: ${GREY_COLOR};
  border-bottom-width: 0.5;
  align-items: center;
  justify-content: center;
`;

const BattleProfileContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 60%;
  /* background-color: red; */
`;

const BattleTalkNameConatiner = styled.View`
  width: 70%;
  justify-content: center;
  align-items: flex-start;
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

const MsgContainer = styled.View`
  width: 10%;
  border-radius: 30px;
  background-color: ${BG_COLOR};
  justify-content: center;
  align-items: center;
`;
const NullMsgContainer = styled.View`
  width: 10%;
  border-radius: 30px;
  background-color: ${TINT_COLOR};
  justify-content: center;
  align-items: center;
`;

const MsgText = styled.Text`
  font-size: 15px;
  color: ${GREY_COLOR2};
  margin-top: ${Platform.OS === 'ios' ? '3px' : '2px'};
  margin-bottom: ${Platform.OS === 'ios' ? '12px' : '10px'};
`;

const UnReadCount = styled.Text`
  color: white;
  font-size: 20px;
  text-align: center;
  justify-content: center;
  align-self: center;
`;

const DateText = styled.Text`
  font-size: 12px;
  color: ${GREY_COLOR};
`;

const ProfileImg = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30;
`;
const NullImg = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30;
`;

const DeleteBtn = styled.TouchableOpacity`
  width: 10%;
  margin-left: 10px;
`;

// 리스트 기본틀
const TalkListSlide = ({
  roomKey,
  id,
  myId,
  profile,
  name,
  msg,
  unReadCount,
  date,
  time,
  battleState,
  deleteChat,
  outCheck,
  navigation,
}) => (
  // 나의 배틀톡 리스트
  <BattleTalkContainer
    onPress={() =>
      navigation.navigate({
        routeName: 'BattleTalk',
        params: {
          roomKey,
          id,
          profile,
          name,
          container: 'BattleTalkList',
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
      <BattleTalkNameConatiner>
        <NameText>{name}</NameText>
        <MsgText numberOfLines={1}>{msg}</MsgText>
      </BattleTalkNameConatiner>
    </BattleProfileContainer>

    {unReadCount !== 0 ? (
      <MsgContainer>
        <UnReadCount>{unReadCount}</UnReadCount>
      </MsgContainer>
    ) : (
      <NullMsgContainer>
        <UnReadCount>{unReadCount}</UnReadCount>
      </NullMsgContainer>
    )}

    <BattleTalkDateContainer>
      <DateText>{date}</DateText>
      <DateText>{time}</DateText>
    </BattleTalkDateContainer>
    {battleState === '배틀종료' ? (
      <DeleteBtn
        onPress={() =>
          Alert.alert(
            '배틀톡 삭제하기',
            '배틀톡을 삭제합니다.\n상대방과 채팅을 할 수 없습니다.',
            [
              {
                text: '취소',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: '삭제',
                onPress: () => deleteChat(roomKey, myId, id),
              },
            ],
            {cancelable: false},
          )
        }>
        <IconDelete size={30} name={'delete-forever'} color={`${BG_COLOR}`} />
      </DeleteBtn>
    ) : (
      <DeleteBtn>
        <IconDelete size={30} name={'delete-forever'} color={`${TINT_COLOR}`} />
      </DeleteBtn>
    )}
  </BattleTalkContainer>
);

export default withNavigation(TalkListSlide);
