import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loader from '../../components/Loader';
import {GREY_COLOR, BG_COLOR, TINT_COLOR} from '../../constants/Colors';
import {Linking} from 'react-native';
import {EMAIL_TITLE, EMAIL_DESCRIPTION} from '../../constants/Strings';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  margin-top: 20px;
  background-color: white;
  /* border-top-left-radius: 15;
  border-top-right-radius: 15; */
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

const BtnImg = styled.Image`
  width: 30px;
  height: 30px;
`;

const BtnImg2 = styled.Image`
  width: 36px;
  height: 27px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  margin-top: ${Platform.OS === 'ios' ? '55px' : '15px'};
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
const AddPresenter = ({loading, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <HeaderContainer>
        <HeaderText>더보기</HeaderText>
      </HeaderContainer>
      <Container>
        {/* <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: '이벤트',
            })
          }>
          <Text>이벤트</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_island.png`)}
          />
        </BtnContainer>

        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: '쇼핑',
            })
          }>
          <Text>쇼핑</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_gift.png`)}
          />
        </BtnContainer> */}

        <BtnContainer
          onPress={() =>
            Linking.openURL(
              'mailto:lespojeju@naver.com?subject=' +
                EMAIL_TITLE +
                '&body=' +
                EMAIL_DESCRIPTION,
            )
          }
          title="lespojeju@naver.com">
          <Text>고객센터</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_callcenter.png`)}
          />
        </BtnContainer>

        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'Notice',
            })
          }>
          <Text>공지사항</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_notice.png`)}
          />
        </BtnContainer>

        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'Setting',
            })
          }>
          <Text>설정</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_setting.png`)}
          />
        </BtnContainer>
      </Container>
    </View>
  );

export default withNavigation(AddPresenter);
