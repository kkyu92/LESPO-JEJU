import React from 'react';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {
  TINT_COLOR,
  BG_COLOR,
  GREY_COLOR2,
  RED_COLOR,
} from '../../../constants/Colors';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import Layout from '../../../constants/Layout';
import PhotoUri from '../../../api/PhotoUri';
import ProfileUri from '../../../api/ProfileUri';
import ChatSlide from '../../../components/ChatSlide';
import Section from '../../../components/Section';
import moment from 'moment';
import SearchNo from '../../Main/Search/SearchNo';

var scrollViewRef = React.createRef();

const Text = styled.Text`
  color: ${BG_COLOR};
`;

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  margin-top: ${Platform.OS === 'ios' ? '35px' : '15px'};
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  /* background-color: goldenrod; */
`;

const TitleText = styled.Text`
  /* width: 40%; */
  color: ${TINT_COLOR};
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  /* background-color: gainsboro; */
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-top: ${Platform.OS === 'ios'
    ? parseInt(Platform.Version) > 12
      ? '20px'
      : '0px'
    : '0px'};
`;
const ProfileContainer = styled.View`
  /* background-color: goldenrod; */
  width: 37%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const ProfileImg = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30;
`;
const ChatProfile = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25;
`;
const Name = styled.Text`
  color: ${TINT_COLOR};
  font-size: 20px;
  font-weight: 800;
  margin-left: 10px;
`;

const BtnContainer = styled.View`
  /* background-color: royalblue; */
  width: 63%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
const Btn = styled.TouchableOpacity`
  border-radius: 5px;
  border-color: ${TINT_COLOR};
  border-width: 1;
  padding: 8px;
  align-items: center;
  justify-content: center;
`;
const RevBtn = styled.TouchableOpacity`
  border-radius: 5px;
  border-color: ${TINT_COLOR};
  background-color: ${TINT_COLOR};
  border-width: 1;
  padding: 8px;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
`;
const BtnText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 16px;
`;
const RevBtnText = styled.Text`
  color: ${BG_COLOR};
  font-size: 16px;
`;
const RedBtnText = styled.Text`
  color: ${RED_COLOR};
  font-size: 16px;
`;

const ChatListContainer = styled.ScrollView`
  flex: 1;
  background-color: ${TINT_COLOR};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 20px;
`;

// 입력창
const InputContainer = styled.View`
  width: ${Layout.width};
  padding: 8px;
  border-top-width: 1;
  border-color: ${GREY_COLOR2};
  bottom: 0;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const Input = styled.TextInput`
  width: 80%;
  max-height: ${Layout.height / 7};
  /* margin-right: 20px; */
  color: black;
  font-size: 14px;
  padding-left: 10px;
  padding-right: 50px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-color: ${GREY_COLOR2};
  border-width: 1;
  border-radius: 15;
  align-self: center;
  justify-content: flex-end;
  background-color: white;
`;

const SendContainer = styled.TouchableOpacity`
  position: absolute;
  justify-content: flex-end;
  right: 0;
  padding-right: 12px;
  margin-right: 12px;
`;

const SendText = styled.Text`
  color: ${BG_COLOR};
  font-size: 14px;
  font-weight: 600;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
var count = 0;

// show DATA
const BattleTalkPresenter = ({
  loading,
  notiCheck,
  getChatList,
  insertChatList,
  msg,
  msgHandler,
  id,
  profile,
  name,
  myId,
  myProfile,
  myName,
  changeModalVisiblity,
  battleState,
  requestUser,
  onSavePlace,
  deleteChat,
  unMount,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    // Platform.OS === 'android' ? (
    //   <KeyboardAvoidingView
    //     style={styles.container}
    //     behavior={Platform.OS === 'ios' ? 'padding' : null}
    //     keyboardVerticalOffset={30}
    //     enabled>
    //     <GiftChat messages={messages} onSend={Fire.send} user={user} />
    //   </KeyboardAvoidingView>
    // ) : (
    //   <SafeAreaView style={{flex: 1}}>
    //     <GiftChat messages={messages} onSend={Fire.send} user={user} />
    //   </SafeAreaView>
    // );
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled>
      <View>
        <TitleContainer>
          <TitleText>배틀톡</TitleText>
        </TitleContainer>
        <HeaderContainer>
          <ProfileContainer>
            <ProfileImg
              source={
                profile
                  ? {uri: ProfileUri(profile)}
                  : require(`../../../assets/drawable-xxhdpi/icon_profile_wh.png`)
              }
            />
            <Name>{name}</Name>
          </ProfileContainer>
          <BtnContainer>
            <Btn
              onPress={() =>
                navigation.navigate({
                  routeName: 'Map',
                  params: {
                    mainState: 'battle',
                    onSavePlace: onSavePlace,
                  },
                })
              }>
              <BtnText>시설보기</BtnText>
            </Btn>
            {/* <Btn>
              <BtnText>이용안내</BtnText>
            </Btn> */}
            {battleState === '배틀신청중' || battleState === '' ? (
              <RevBtn onPress={() => changeModalVisiblity(true)}>
                <RevBtnText>배틀신청</RevBtnText>
              </RevBtn>
            ) : battleState === '배틀진행중' ? (
              <RevBtn>
                <RevBtnText>신청완료</RevBtnText>
              </RevBtn>
            ) : battleState === '배틀요청' ? (
              requestUser === JSON.stringify(myId) ? (
                <RevBtn>
                  <RedBtnText>배틀신청중</RedBtnText>
                </RevBtn>
              ) : (
                <RevBtn onPress={() => changeModalVisiblity(true)}>
                  <RedBtnText>신청수락</RedBtnText>
                </RevBtn>
              )
            ) : (
              <RevBtn>
                <RevBtnText>배틀종료</RevBtnText>
              </RevBtn>
            )}
          </BtnContainer>
        </HeaderContainer>
        <ChatListContainer
          ref={scrollViewRef}
          scrollIndicatorInsets={{right: 1}}
          // onContentSizeChange={(contentWidth, contentHeight) => {
          //   console.log('onContentSizeChange');
          //   handleScroll(contentHeight);
          // }}
          // scrollToOverflowEnabled={true}
          // onScroll={handleScroll}
          // scrollTo={{y: height}}
          //         setTimeout(() => {
          //   this.scrollView.scrollTo({ x: DEVICE_WIDTH * current_index, y: 0, animated: false });
          // }, 1)
        >
          {loading ? (
            <Loader />
          ) : getChatList.length > 0 ? (
            <Section horizontal={false} title="chat">
              {getChatList
                .filter(list => list.msg !== null)
                .map((value, index, list) =>
                  list.length === 1 ? (
                    <ChatSlide
                      prevDate={''}
                      nextDate={''}
                      prevUser={''}
                      nextUser={''}
                      date={list[index].date}
                      msg={list[index].msg}
                      user={list[index].user}
                      reader={list[index].read}
                      place={list[index].place}
                      name={name}
                      profile={profile}
                      myId={myId}
                      myName={myName}
                      myProfile={myProfile}
                      onSavePlace={onSavePlace}
                    />
                  ) : index === list.length - 1 ? (
                    <ChatSlide
                      prevDate={list[index - 1].date}
                      nextDate={''}
                      prevUser={list[index - 1].user}
                      nextUser={''}
                      date={list[index].date}
                      msg={list[index].msg}
                      user={list[index].user}
                      reader={list[index].read}
                      place={list[index].place}
                      name={name}
                      profile={profile}
                      myName={myName}
                      myId={myId}
                      myProfile={myProfile}
                      onSavePlace={onSavePlace}
                    />
                  ) : index === 0 ? (
                    <ChatSlide
                      prevDate={''}
                      nextDate={list[index + 1].date}
                      prevUser={''}
                      nextUser={list[index + 1].user}
                      date={list[index].date}
                      msg={list[index].msg}
                      user={list[index].user}
                      reader={list[index].read}
                      place={list[index].place}
                      name={name}
                      profile={profile}
                      myName={myName}
                      myId={myId}
                      myProfile={myProfile}
                      onSavePlace={onSavePlace}
                    />
                  ) : (
                    <ChatSlide
                      prevDate={list[index - 1].date}
                      nextDate={list[index + 1].date}
                      prevUser={list[index - 1].user}
                      nextUser={list[index + 1].user}
                      date={list[index].date}
                      msg={list[index].msg}
                      user={list[index].user}
                      reader={list[index].read}
                      place={list[index].place}
                      name={name}
                      profile={profile}
                      myName={myName}
                      myId={myId}
                      myProfile={myProfile}
                      onSavePlace={onSavePlace}
                    />
                  ),
                )}
            </Section>
          ) : notiCheck === true ? (
            <SearchNo text={'채팅 내역을 불러오는 중입니다...'} />
          ) : (
            console.log('no chattingList')
          )}
          {/* <Text>{JSON.stringify(getChatList)}</Text> */}
        </ChatListContainer>
      </View>
      {deleteChat[id] === id ? null : (
        <InputContainer>
          <ChatProfile
            source={
              myProfile
                ? {uri: ProfileUri(myProfile)}
                : require(`../../../assets/drawable-xxhdpi/icon_profile.png`)
              // console.log('myPofile:' + myProfile))
            }
          />
          <Input
            onFocus={_scrollToBottom(unMount)}
            onChangeText={msgHandler}
            value={msg}
            // autoFocus
            returnKeyType={'next'}
            placeholder="메시지 작성"
            placeholderTextColor={GREY_COLOR2}
            // onSubmitEditing={onSubmitEditing}
            autoCorrect={false}
            multiline={true}
          />
          <SendContainer onPress={() => insertChatList(msg)}>
            <SendText>보내기</SendText>
          </SendContainer>
        </InputContainer>
      )}
    </KeyboardAvoidingView>
  );

const _scrollToBottom = unMount => {
  setTimeout(() => {
    scrollViewRef.current.scrollToEnd({animated: true});
  }, 100);
  // if (unMount === 0) {
  //   setTimeout(() => {
  //     scrollViewRef.current.scrollToEnd({animated: true});
  //   }, 100);
  //   unMount = 1;
  // } else {
  //   scrollViewRef.current.scrollToEnd({animated: true});
  // }
};

export default withNavigation(BattleTalkPresenter);
