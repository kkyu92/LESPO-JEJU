import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {BG_COLOR, TINT_COLOR, GREY_COLOR3} from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import {Platform} from 'react-native';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import SearchNo from '../../../screens/Main/Search/SearchNo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const MapBtn = styled.TouchableOpacity`
  width: ${Layout.width / 3};
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  padding: 5px;
  flex-direction: row;
  border-radius: 10px;
  border-color: ${TINT_COLOR};
  border-width: 1px;
  align-items: center;
  align-self: flex-end;
  justify-content: space-around;
`;
const MapText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 14px;
`;

const Container = styled.ScrollView`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: white;
  padding-top: 10;
  padding-bottom: 20;
  padding-left: 20;
  flex: 1;
`;

// show DATA
const WFoodPresenter = ({loading, listChanged, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <MapBtn
        onPress={() =>
          navigation.navigate({
            routeName: 'Map',
            params: {listChanged},
          })
        }>
        <MapText>지도로 보기</MapText>
        <Icon size={30} name={'map-marker-radius'} color={`${TINT_COLOR}`} />
      </MapBtn>
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <>
            {listChanged ? (
              listChanged.length > 0 ? (
                <Section horizontal={false} title="">
                  {listChanged
                    .filter(list => list.backdrop_path !== null)
                    .map(list => (
                      <SubSlide
                        tag={'notag'}
                        horizontal={false}
                        key={list.id}
                        id={list.id}
                        backgroundPoster={list.backdrop_path}
                        title={list.title}
                        avg={list.vote_average}
                        overview={list.overview}
                      />
                    ))}
                </Section>
              ) : (
                <SearchNo handleGetSearchText={searchTerm} />
              )
            ) : (
              console.log('null')
            )}
          </>
        )}
      </Container>
    </View>
  );

export default withNavigation(WFoodPresenter);
