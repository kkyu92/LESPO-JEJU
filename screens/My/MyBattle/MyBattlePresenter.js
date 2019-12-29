import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {BG_COLOR, TINT_COLOR, BLACK_COLOR} from '../../../constants/Colors';
import {Platform} from 'react-native';
import Section from '../../../components/Section';
import SearchNo from '../../Main/Search/SearchNo';
import BattleSlide from '../../../components/BattleSlide';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-top: 20;
  padding-bottom: 20;
  flex: 1;
`;

const MyBattlePresenter = ({loading, listChanged}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
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
                      <BattleSlide
                        myBattleList={true}
                        key={list.id}
                        id={list.id}
                        profile={list.backdrop_path}
                        name={'박명수'}
                        level={'초고수'}
                        rate={list.vote_average}
                        sport={list.title}
                        type={'개인전'}
                        date={'2020-01-22'}
                        area={'제주시 연동'}
                        memo={list.overview}
                        statusText={'배틀종료'}
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

export default withNavigation(MyBattlePresenter);
