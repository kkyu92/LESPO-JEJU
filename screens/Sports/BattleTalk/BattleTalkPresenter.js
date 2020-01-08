import React from 'react';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {
  TINT_COLOR,
  BG_COLOR,
  GREY_COLOR,
  GREY_COLOR2,
} from '../../../constants/Colors';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import Layout from '../../../constants/Layout';
import PhotoUri from '../../../api/PhotoUri';
import ProfileUri from '../../../api/ProfileUri';
import AsyncStorage from '@react-native-community/async-storage';

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
  justify-content: space-between;
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
`;
const BtnText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 16px;
`;
const RevBtnText = styled.Text`
  color: ${BG_COLOR};
  font-size: 16px;
`;

const ChatListContainer = styled.View`
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

// show DATA
const BattleTalkPresenter = ({
  loading,
  insertChatList,
  msg,
  date,
  profile,
  name,
  my_name,
  my_profile,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View>
        <TitleContainer>
          <TitleText>배틀톡</TitleText>
        </TitleContainer>
        <HeaderContainer>
          <ProfileContainer>
            <ProfileImg source={{uri: PhotoUri(profile)}} />
            <Name>{name}</Name>
          </ProfileContainer>
          <BtnContainer>
            <Btn>
              <BtnText>시설보기</BtnText>
            </Btn>
            <Btn>
              <BtnText>이용안내</BtnText>
            </Btn>
            <RevBtn>
              <RevBtnText>배틀시작</RevBtnText>
            </RevBtn>
          </BtnContainer>
        </HeaderContainer>
        <ChatListContainer></ChatListContainer>
      </View>

      <InputContainer>
        <ChatProfile
          source={
            my_profile
              ? {uri: ProfileUri(my_profile)}
              : require(`../../../assets/drawable-xxhdpi/icon_profile.png`)
          }
        />
        <Input
          //   onChangeText={handleSearchUpdate}
          // value={searchTerm}
          // autoFocus
          returnKeyType={'next'}
          placeholder="메시지 작성"
          placeholderTextColor={GREY_COLOR2}
          // onSubmitEditing={onSubmitEditing}
          autoCorrect={false}
          multiline={true}
        />
        <SendContainer>
          <SendText>보내기</SendText>
        </SendContainer>
      </InputContainer>
    </KeyboardAvoidingView>
  );

export default withNavigation(BattleTalkPresenter);
