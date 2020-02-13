import React from 'react';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import {TINT_COLOR, BG_COLOR} from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const AdApplyContainer = styled.TouchableOpacity`
  border-radius: 5;
  border-width: 2;
  border-color: ${TINT_COLOR};
  align-items: center;
  justify-content: flex-end;
  margin: 20px;
`;

const AdApplyText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 24px;
  border-radius: 5;
  padding: 5px;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-left: 20;
  padding-top: 20;
  padding-bottom: 20;
  flex: 1;
`;

const JejuPresenter = ({loading, listChanged}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <AdApplyContainer>
        <AdApplyText>구매문의</AdApplyText>
      </AdApplyContainer>
      <Container showsVerticalScrollIndicator={false}>
        {listChanged ? (
          listChanged.length > 0 ? (
            <Section horizontal={false} title="제주의 소리">
              {listChanged
                .filter(list => list.id !== null)
                .map(list => (
                  <SubSlide
                    tag={'image'}
                    horizontal={false}
                    key={list.id}
                    id={list.id}
                    backgroundPoster={list.banner.full_filename}
                    poster={list.matched_content_images}
                    title={list.title}
                    overview={list.description}
                    detail={list.detail}
                    // avg={list.vote_average}
                  />
                ))}
            </Section>
          ) : (
            <SearchNo text={'등록된 광고가 없습니다.'} />
          )
        ) : (
          console.log('null')
        )}
      </Container>
    </View>
  );

export default JejuPresenter;
