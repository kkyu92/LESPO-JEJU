import React from 'react';
import {StyleSheet, Linking} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components';
import {BG_COLOR, TINT_COLOR, GREY_COLOR2} from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../../components/Loader';
import {withNavigation} from 'react-navigation';
import CheckboxForm from 'react-native-checkbox-form';

const ViewContainer = styled.View`
  flex: 1;
  /* background-color: ${BG_COLOR}; */
  padding: 20px;
`;

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
});

const HeaderContainer = styled.View`
  flex-direction: row;
  margin-top: ${Platform.OS === 'ios' ? '20px' : '0px'};
  margin-bottom: 40px;
  align-items: center;
  justify-content: space-between;
`;

const HeaderIcon = styled.TouchableOpacity``;

const HeaderTitle = styled.Text`
  color: ${TINT_COLOR};
  font-size: 28px;
  font-weight: bold;
  align-items: center;
  justify-content: center;
`;

const ScrollView = styled.ScrollView``;

const Title = styled.Text`
  color: ${TINT_COLOR};
  font-size: 28px;
  font-weight: 800;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${TINT_COLOR};
`;

const TextInput = styled.TextInput`
  color: ${TINT_COLOR};
  padding: 5px;
  border-bottom-width: 1;
  border-color: ${TINT_COLOR};
  margin-top: 10px;
  margin-bottom: 20px;
`;

const BtnContainer = styled.TouchableOpacity`
  background-color: ${TINT_COLOR};
  border-radius: 15px;
  flex-direction: row;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-top: 40px;
`;

const TextContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TouchableOpacity = styled.TouchableOpacity``;

const BtnText = styled.Text`
  color: ${BG_COLOR};
  font-size: 16px;
`;

const Blank = styled.View`
  width: 45%;
  background-color: royalblue;
`;

const checkData = [
  {
    label: '',
    RNchecked: false,
  },
];
_onSelect = item => {
  onCheckSignup;
  console.log(item[0].RNchecked);
};

const SignupPresenter = ({
  loading,
  checked,
  handleEmailText,
  handleNameText,
  handlePasswordText,
  handleCheckPasswordText,
  handleCheckBox,
  onCheckSignup,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <LinearGradient
      start={{x: 0.0, y: 0.25}}
      end={{x: 0.5, y: 1.0}}
      locations={[0, 0.5, 0.6]}
      colors={['#fedd66', '#f98b59', '#f55b60']}
      style={styles.linearGradient}>
      <ViewContainer>
        <HeaderContainer>
          <HeaderIcon onPress={() => navigation.goBack(null)}>
            <Icon
              size={30}
              name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
              color={`${TINT_COLOR}`}
            />
          </HeaderIcon>
          <HeaderTitle>제주배틀투어</HeaderTitle>
          <HeaderTitle> </HeaderTitle>
        </HeaderContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Title>회원가입</Title>

          <SubTitle>아이디</SubTitle>
          <TextInput
            returnKeyType={'done'}
            keyboardType={'email-address'}
            placeholder={'아이디로 사용할 이메일을 입력해주세요.'}
            placeholderTextColor={GREY_COLOR2}
            onChangeText={handleEmailText}
          />

          <SubTitle>이름</SubTitle>
          <TextInput
            returnKeyType={'done'}
            keyboardType={'default'}
            placeholder={'이름 (한글 2~4자 / 영문 2~10자 이내).'}
            placeholderTextColor={GREY_COLOR2}
            onChangeText={handleNameText}
          />

          <SubTitle>비밀번호</SubTitle>
          <TextInput
            returnKeyType={'done'}
            keyboardType={'default'}
            placeholder={'비밀번호 (영문숫자포함 6~12자).'}
            placeholderTextColor={GREY_COLOR2}
            secureTextEntry
            onChangeText={handlePasswordText}
          />
          <SubTitle>비밀번호 확인</SubTitle>
          <TextInput
            returnKeyType={'done'}
            keyboardType={'default'}
            placeholder={'비밀번호 확인.'}
            placeholderTextColor={GREY_COLOR2}
            secureTextEntry
            onChangeText={handleCheckPasswordText}
          />

          <TextContainer>
            <CheckboxForm
              style={{width: 10, backgroundColor: {BG_COLOR}}}
              dataSource={checkData}
              itemShowKey="label"
              itemCheckedKey="RNchecked"
              iconSize={26}
              iconColor={TINT_COLOR}
              formHorizontal={false}
              labelHorizontal={true}
              onChecked={item => handleCheckBox(item[0].RNchecked)}
            />

            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.jejubattle.com/privacy')
              }>
              <SubTitle>이용약관 및 개인정보보호</SubTitle>
            </TouchableOpacity>
            <Blank />
          </TextContainer>

          <BtnContainer onPress={onCheckSignup}>
            <BtnText>회원가입</BtnText>
          </BtnContainer>
        </ScrollView>
      </ViewContainer>
    </LinearGradient>
  );

export default withNavigation(SignupPresenter);
