import React from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import {BG_COLOR, TINT_COLOR, GREY_COLOR2} from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Loader from '../../components/Loader';
import {withNavigation} from 'react-navigation';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

const FBSDK = require('react-native-fbsdk');
const {GraphRequest, GraphRequestManager} = FBSDK;
const TOKEN = '';

const ViewContainer = styled.View`
  flex: 1;
  /* background-color: ${BG_COLOR}; */
  padding: 20px;
`;

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  }})

const HeaderTitle = styled.Text`
  color: ${TINT_COLOR};
  font-size: 28px;
  font-weight: bold;
  margin-top: ${Platform.OS === 'ios' ? '20px' : '0px'};
  margin-bottom: 40px;
  align-self: center;
  justify-content: center;
`;

const Title = styled.Text`
  color: ${TINT_COLOR};
  font-size: 28px;
  font-weight: 800;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${TINT_COLOR};
  margin-top: 20px;
  margin-bottom: 10px;
`;

const TextInput = styled.TextInput`
  color: ${TINT_COLOR};
  padding: 5px;
  border-bottom-width: 1;
  border-color: ${TINT_COLOR};
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

const TouchableOpacity = styled.TouchableOpacity`
  margin-left: 20px;
  margin-right: 20px;
`;

const BtnText = styled.Text`
  color: ${BG_COLOR};
  font-size: 16px;
`;

const ImgView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ImgContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: ${Layout.width / 4 + 15};
`;

const Img = styled.Image`
  width: ${Layout.width / 4 + 15};
  height: 50px;
  background-color: ${TINT_COLOR};
  border-radius: 10px;
`;

const LoginPresenter = ({loading, email, password, kakaoLogin, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <LinearGradient start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
    locations={[0,0.5,0.6]} colors={['#fedd66', '#f98b59', '#f55b60']} style={styles.linearGradient}>
    <ViewContainer>
      <HeaderTitle>제주배틀투어</HeaderTitle>
      <Title>Log in</Title>

      <SubTitle>아이디</SubTitle>
      <TextInput
        returnKeyType={'done'}
        keyboardType={'email-address'}
        placeholder={'이메일을 입력해주세요.'}
        placeholderTextColor={GREY_COLOR2}
        // onChangeText={handleSearchUpdate}
        // value={searchTerm}
        // onSubmitEditing={onSubmitEditing}
      />

      <SubTitle>비밀번호</SubTitle>
      <TextInput
        returnKeyType={'done'}
        keyboardType={'default'}
        placeholder={'비밀번호를 입력해주세요.'}
        placeholderTextColor={GREY_COLOR2}
        secureTextEntry
      />

      <BtnContainer
        onPress={() =>
          navigation.navigate({
            routeName: 'Tabs',
          })
        }>
        <BtnText>로그인</BtnText>
      </BtnContainer>

      <TextContainer>
        <TouchableOpacity>
          <SubTitle>비밀번호찾기</SubTitle>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate({
              routeName: 'Signup',
            })
          }>
          <SubTitle>회원가입</SubTitle>
        </TouchableOpacity>
      </TextContainer>

      <SubTitle>SNS 로그인</SubTitle>
      <ImgView>
        <ImgContainer onPress={() => kakaoLogin()}>
          <Img
            source={require(`../../assets/drawable-xxhdpi/btn_login_01.png`)}
          />
        </ImgContainer>
        <ImgContainer>
          <Img
            source={require(`../../assets/drawable-xxhdpi/btn_login_02.png`)}
          />
        </ImgContainer>
        <ImgContainer
          onPress={() =>
            LoginManager.logInWithPermissions(['public_profile']).then(
              function(result) {
                if (result.isCancelled) {
                  console.log('Login cancelled');
                } else {
                  AccessToken.getCurrentAccessToken().then(data => {
                    let accessToken = data.accessToken;
                    // alert(accessToken.toString());

                    const responseInfoCallback = (error, result) => {
                      if (error) {
                        console.log(error);
                        alert('Error fetching data: ' + error.toString());
                      } else {
                        console.log(
                          result.id,
                          result.name,
                          result.picture.data.url,
                        );
                        alert('Success fetching data: ' + result.name);
                      }
                    };

                    const infoRequest = new GraphRequest(
                      '/me',
                      {
                        accessToken: accessToken,
                        parameters: {
                          fields: {
                            string: 'id,name,picture',
                            // picture.type(large)
                          },
                        },
                      },
                      responseInfoCallback,
                    );

                    // Start the graph request.
                    new GraphRequestManager().addRequest(infoRequest).start();
                  });
                }
              },
              function(error) {
                console.log('Login fail with error: ' + error);
              },
            )
          }>
          <Img
            source={require(`../../assets/drawable-xxhdpi/btn_login_03.png`)}
          />
        </ImgContainer>
      </ImgView>
    </ViewContainer>
    </LinearGradient>
  );
  
export default withNavigation(LoginPresenter);
