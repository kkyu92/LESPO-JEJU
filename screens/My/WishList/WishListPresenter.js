import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import {TINT_COLOR, BG_COLOR} from '../../../constants/Colors';
import {Platform} from 'react-native';
import SearchNo from '../../Main/Search/SearchNo';

const View = styled.View`
  background-color: orange;
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

const MapIcon = styled.TouchableOpacity`
  justify-content: flex-end;
  align-items: flex-end;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

const WishListPresenter = ({loading, getJejuSound}) =>
  loading ? (
    <Loader />
  ) : getJejuSound ? (
    <View>
      <Container>
        <MapIcon>
          <Icon size={30} name={'map-marker-radius'} color={`${BG_COLOR}`} />
        </MapIcon>
        <Section horizontal={false} title="관광 상품">
          {getJejuSound
            .filter(list => list.backdrop_path !== null)
            .map(list => (
              <SubSlide
                tag={'tag'}
                horizontal={false}
                key={list.id}
                id={list.id}
                backgroundPoster={list.backdrop_path}
                title={list.name}
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

export default WishListPresenter;
