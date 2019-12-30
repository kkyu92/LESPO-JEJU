import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {BG_COLOR, TINT_COLOR, BLACK_COLOR} from '../../../constants/Colors';
import {Platform} from 'react-native';
import Section from '../../../components/Section';
import SearchNo from '../../Main/Search/SearchNo';
import TalkListSlide from '../../../components/TalkListSlide';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const TitleContainer = styled.View`
  padding: 20px;
`;

const TitleText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 5px;
  margin-right: 5px;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-top: 10;
  padding-bottom: 20;
  flex: 1;
`;

const BattleTalkPresenter = ({loading, listChanged}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <TitleContainer>
        <TitleText>나의 배틀상대와{'\n'}대화해보세요.</TitleText>
      </TitleContainer>
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
                      <TalkListSlide
                        key={list.id}
                        id={list.id}
                        profile={list.backdrop_path}
                        name={list.title}
                        date={'2020/01/22'}
                        time={'14:00'}
                        msg={list.overview}
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

export default withNavigation(BattleTalkPresenter);
