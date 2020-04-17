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
  margin-top: ${Platform.OS === 'ios' ? '20px' : '20px'};
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

const BigCard = styled.TouchableOpacity`
  width: ${Layout.width - 80};
  height: ${Layout.width / 2 - 50};
  background-color: ${TINT_COLOR};
  border-color: ${BG_COLOR};
  border-width: 2px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

const Card = styled.TouchableOpacity`
  width: ${Layout.width / 2 - 50};
  height: ${Layout.width / 2 - 50};
  background-color: ${TINT_COLOR};
  border-color: ${BG_COLOR};
  border-width: 2px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

const BigImg = styled.Image`
  width: 90px;
  height: 90px;
`;

const Img = styled.Image`
  width: 70px;
  height: 70px;
`;

const Text = styled.Text`
  margin-top: 10px;
  color: ${BG_COLOR};
  align-self: center;
  font-size: 15px;
  font-weight: 600;
`;

const HeaderContainer = styled.View`
  flex-direction: column;
  margin-top: ${Platform.OS === 'ios' ? '50px' : '0px'};
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 10px;
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
          <HeaderText />
          <HeaderText>여행하기</HeaderText>
        </HeaderContainer>
        {/* <TitleText>좋아하는 여행을 찾아보세요!</TitleText> */}
        <View>
          <Container>
            <BigCard
              onPress={() =>
                navigation.navigate({
                  routeName: 'Recommend',
                })
              }>
              <BigImg
                source={require(`../../assets/drawable-xxhdpi/icon-favorite.png`)}
              />
              <Text>추천관광</Text>
            </BigCard>
          </Container>
          <Container>
            <Card
              onPress={() =>
                navigation.navigate({
                  routeName: 'Food',
                })
              }>
              <Img
                source={require(`../../assets/drawable-xxhdpi/icon-fnb.png`)}
              />
              <Text>먹거리</Text>
            </Card>
            <Card
              onPress={() =>
                navigation.navigate({
                  routeName: 'View',
                })
              }>
              <Img
                source={require(`../../assets/drawable-xxhdpi/icon-sightseeing.png`)}
              />
              <Text>볼거리</Text>
            </Card>
          </Container>
          <Container>
            <Card
              onPress={() =>
                navigation.navigate({
                  routeName: 'Leisure',
                })
              }>
              <Img
                source={require(`../../assets/drawable-xxhdpi/icon-exciting.png`)}
              />
              <Text>레저스포츠</Text>
            </Card>
            <Card
              onPress={() =>
                navigation.navigate({
                  routeName: 'Sports',
                })
              }>
              <Img
                source={require(`../../assets/drawable-xxhdpi/icon-exercise.png`)}
              />
              <Text>운동시설</Text>
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
