import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loader from '../../components/Loader';
import {BG_COLOR, TINT_COLOR, BLACK_COLOR} from '../../constants/Colors';
import Layout from '../../constants/Layout';

const View = styled.View`
  background-color: ${TINT_COLOR};
  flex: 1;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  justify-content: center;
  align-items: center;
`;
const TitleContainer = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;
const TitleText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 18px;
  font-weight: 800;
  margin: 30px;
  text-align: center;
  align-self: center;
  justify-content: center;
`;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Card = styled.TouchableOpacity`
  width: ${Layout.width / 2 - 50};
  height: ${Layout.width / 2};
  background-color: ${BG_COLOR};
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

const Img = styled.Image`
  width: 70px;
  height: 70px;
`;
const Img2 = styled.Image`
  width: 65px;
  height: 76px;
`;

const Text = styled.Text`
  margin-top: 20px;
  color: ${TINT_COLOR};
  align-self: center;
  font-size: 14px;
  font-weight: 600;
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
const TripPresenter = ({loading, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <>
      <TitleContainer>
        <HeaderContainer>
          <HeaderText>여행하기</HeaderText>
        </HeaderContainer>
        <TitleText>좋아하는 여행을 찾아보세요!</TitleText>

        <View>
          <Container>
            <Card
              onPress={() =>
                navigation.navigate({
                  routeName: 'Recommend',
                })
              }>
              <Img
                source={require(`../../assets/drawable-xxhdpi/icon_sightseeing.png`)}
              />
              <Text>추천관광</Text>
            </Card>
            <Card>
              <Img
                source={require(`../../assets/drawable-xxhdpi/icon_meal.png`)}
              />
              <Text>먹거리</Text>
            </Card>
          </Container>
          <Container>
            <Card>
              <Img2
                source={require(`../../assets/drawable-xxhdpi/icon_viewthing.png`)}
              />
              <Text>볼거리</Text>
            </Card>
            <Card>
              <Img
                source={require(`../../assets/drawable-xxhdpi/icon_snorkle.png`)}
              />
              <Text>익사이팅</Text>
            </Card>
          </Container>
        </View>
      </TitleContainer>
    </>
  );

TripPresenter.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default withNavigation(TripPresenter);
