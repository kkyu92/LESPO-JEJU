import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loader from '../../components/Loader';
import {TINT_COLOR, BG_COLOR, GREY_COLOR} from '../../constants/Colors';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {Platform} from 'react-native';
import {withNavigation} from 'react-navigation';

const STAR_IMAGE = require(`../../assets/drawable-xxxhdpi/icon_star.png`);

const View = styled.View`
  background-color: orange;
  flex: 1;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 30px;
  margin-right: 30px;
`;

const LeftContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Profile = styled.Image`
  width: 60;
  height: 60;
  margin-right: 10px;
`;

const ProfileTextContainer = styled.View`
  align-content: center;
  justify-content: center;
`;

const ProfileNameContainer = styled.View`
  flex-direction: row;
  /* justify-content: center; */
  align-content: center;
`;

const BattleCoinList = styled.TouchableOpacity`
  flex-direction: row;
  align-content: center;
`;

const NameText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 24px;
  font-weight: 800;
  /* margin-bottom: 5px; */
  margin-right: 5px;
`;
const BattleText = styled.Text`
  color: ${TINT_COLOR};
`;
const CoinText = styled.Text`
  color: ${TINT_COLOR};
  font-weight: 600;
`;

const CoinCharge = styled.TouchableOpacity`
  border-radius: 5;
  background-color: ${TINT_COLOR};
  align-content: center;
  justify-content: center;
  padding: 15px;
`;

const OrangeText = styled.Text`
  color: ${BG_COLOR};
`;

const Container = styled.View`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-left: 20;
  padding-right: 20;
  padding-top: 20;
  padding-bottom: 20;
  flex: 1;
`;

const BtnContainer = styled.TouchableOpacity`
  flex-direction: row;
  border-color: ${GREY_COLOR};
  border-bottom-width: 0.5;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const Text = styled.Text`
  color: black;
  font-size: 20;
  align-items: center;
`;

const TextLogout = styled.Text`
  color: ${BG_COLOR};
  font-size: 20;
  font-weight: 800;
  align-items: center;
`;

const BtnImg = styled.Image`
  width: 27px;
  height: 27px;
`;

const BtnImg2 = styled.Image`
  width: 30px;
  height: 25px;
`;

// show DATA
const MyPresenter = ({loading, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <ProfileContainer>
        <LeftContainer>
          <Profile
            source={require(`../../assets/drawable-xxxhdpi/icon_profile_wh.png`)}
          />
          <ProfileTextContainer>
            <ProfileNameContainer>
              <NameText>홍길동</NameText>
              <Rating
                // type="custom"
                // ratingImage={STAR_IMAGE}
                tintColor={BG_COLOR}
                // ratingColor={TINT_COLOR}
                // ratingBackgroundColor={BG_COLOR}
                startingValue={3.5}
                ratingCount={5}
                imageSize={15}
                readonly
                style={
                  Platform.OS === 'ios'
                    ? {paddingVertical: 5}
                    : {paddingVertical: 12}
                }
              />
            </ProfileNameContainer>
            <BattleCoinList>
              <BattleText>배틀코인 </BattleText>
              <CoinText> 30coin</CoinText>
            </BattleCoinList>
          </ProfileTextContainer>
        </LeftContainer>
        <CoinCharge>
          <OrangeText>코인충전</OrangeText>
        </CoinCharge>
      </ProfileContainer>
      <Container>
        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'MyBattleList',
            })
          }>
          <Text>나의 배틀</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_mybattle.png`)}
          />
        </BtnContainer>
        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'JejuSound',
            })
          }>
          <Text>배틀 톡</Text>
          <BtnImg2
            source={require(`../../assets/drawable-xxhdpi/icon_battletalk.png`)}
          />
        </BtnContainer>
        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'JejuSound',
            })
          }>
          <Text>위시리스트</Text>
          <BtnImg2
            source={require(`../../assets/drawable-xxhdpi/icon_wishlist.png`)}
          />
        </BtnContainer>
        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'JejuSound',
            })
          }>
          <TextLogout>로그아웃</TextLogout>
        </BtnContainer>
        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'JejuSound',
            })
          }>
          <Text>회원탈퇴</Text>
        </BtnContainer>
      </Container>
    </View>
  );

MyPresenter.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default withNavigation(MyPresenter);
