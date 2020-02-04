import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loader from '../../components/Loader';
import {TINT_COLOR, BG_COLOR, GREY_COLOR} from '../../constants/Colors';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {Platform, Alert} from 'react-native';
import MyModal from '../../components/AlertProDialog';
import {withNavigation} from 'react-navigation';

const View = styled.View`
  background-color: ${BG_COLOR};
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
  justify-content: center;
`;

const Profile = styled.Image`
  border-radius: 30px;
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

const ProfileTextContainer = styled.View`
  align-content: center;
  justify-content: center;
  margin-top: 5px;
`;

const ProfileNameContainer = styled.View`
  flex-direction: row;
  /* justify-content: center; */
  align-content: center;
`;

const BattleCoinList = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 5px;
`;

const NameText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 24px;
  font-weight: 800;
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
  font-size: 20px;
  align-items: center;
`;

const TextLogout = styled.Text`
  color: ${BG_COLOR};
  font-size: 20px;
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

const HeaderContainer = styled.View`
  flex-direction: row;
  margin-top: ${Platform.OS === 'ios' ? '35px' : '15px'};
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  /* background-color: goldenrod; */
`;

const HeaderText = styled.Text`
  /* width: 40%; */
  color: ${TINT_COLOR};
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  /* background-color: gainsboro; */
`;

// show DATA
const MyPresenter = ({
  loading,
  name,
  profile,
  rating,
  coin,
  changeModalVisiblity,
  setData,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <HeaderContainer>
        <HeaderText>내정보</HeaderText>
      </HeaderContainer>
      <ProfileContainer>
        <LeftContainer>
          {profile === null || profile === '' ? (
            <Profile
              source={require(`../../assets/drawable-xxxhdpi/icon_profile_wh.png`)}
            />
          ) : (
            <Profile source={{uri: profile}} />
          )}
          <ProfileTextContainer>
            <ProfileNameContainer>
              <NameText>{name}</NameText>
              <Rating
                // type="custom"
                // ratingImage={STAR_IMAGE}
                tintColor={BG_COLOR}
                // ratingColor={TINT_COLOR}
                // ratingBackgroundColor={BG_COLOR}
                startingValue={rating}
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
              <CoinText> {coin} coin</CoinText>
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
              routeName: 'MyBattleTalk',
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
              routeName: 'MyWishList',
            })
          }>
          <Text>위시리스트</Text>
          <BtnImg2
            source={require(`../../assets/drawable-xxhdpi/icon_wishlist.png`)}
          />
        </BtnContainer>
        <BtnContainer
          onPress={
            () => changeModalVisiblity(true)

            // // Works on both Android and iOS
            // Alert.alert(
            //   '로그아웃 하시겠습니까?',
            //   '',
            //   [
            //     // {
            //     //   text: 'Ask me later',
            //     //   onPress: () => console.log('Ask me later pressed'),
            //     // },
            //     {
            //       text: '취소',
            //       onPress: () => console.log('로그아웃 취소'),
            //       style: 'destructive',
            //     },
            //     {text: '로그아웃', onPress: () => console.log('로그아웃')},
            //   ],
            //   {cancelable: false},
            // )
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
