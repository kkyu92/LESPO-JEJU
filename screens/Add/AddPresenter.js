import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loader from '../../components/Loader';
import {GREY_COLOR, BG_COLOR, TINT_COLOR} from '../../constants/Colors';

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
  border-top-left-radius: 15;
  border-top-right-radius: 15;
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
  font-size: 25;
  align-items: center;
`;

const BtnImg = styled.Image`
  width: 25px;
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
const AddPresenter = ({loading, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <HeaderContainer>
        <HeaderText>더보기</HeaderText>
      </HeaderContainer>
      <Container>
        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'JejuSound',
            })
          }>
          <Text>제주의 소리</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_island.png`)}
          />
        </BtnContainer>

        <BtnContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'JejuGift',
            })
          }>
          <Text>관광상품</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_gift.png`)}
          />
        </BtnContainer>

        <BtnContainer>
          <Text>고객센터</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_callcenter.png`)}
          />
        </BtnContainer>

        <BtnContainer>
          <Text>공지사항</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_notice.png`)}
          />
        </BtnContainer>

        <BtnContainer>
          <Text>설정</Text>
          <BtnImg
            source={require(`../../assets/drawable-xxhdpi/icon_setting.png`)}
          />
        </BtnContainer>
      </Container>
    </View>
  );

export default withNavigation(AddPresenter);
