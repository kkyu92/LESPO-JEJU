import React from 'react';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import {TINT_COLOR, BG_COLOR} from '../../../constants/Colors';
import {Platform} from 'react-native';
import SearchNo from '../../Main/Search/SearchNo';
import Layout from '../../../constants/Layout';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-left: 20;
  padding-bottom: 20;
  margin-top: 20;
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
  border-color: ${BG_COLOR};
  border-width: 1px;
  align-items: center;
  align-self: flex-end;
  justify-content: space-around;
`;
const MapText = styled.Text`
  color: ${BG_COLOR};
  font-size: 14px;
`;

const WishListPresenter = ({loading, listChanged, navigation}) =>
  loading ? (
    <Loader />
  ) : listChanged ? (
    <View>
      <Container>
        <MapBtn
          onPress={() =>
            navigation.navigate({
              routeName: 'Map',
              params: {listChanged},
            })
          }>
          <MapText>지도로 보기</MapText>
          <Icon size={30} name={'map-marker-radius'} color={`${BG_COLOR}`} />
        </MapBtn>
        <Section horizontal={false} title="관광 상품">
          {listChanged
            .filter(list => list.backdrop_path !== null)
            .map(list => (
              <SubSlide
                tag={'tag'}
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
      </Container>
    </View>
  ) : (
    <SearchNo handleGetSearchText={'등록된 위시리스트가 없습니다.'} />
  );

export default withNavigation(WishListPresenter);
