import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loader from '../../../components/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';
import {
  BG_COLOR,
  BLACK_COLOR,
  GREY_COLOR,
  GREY_COLOR2,
} from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import SearchNo from './SearchNo';

const Container = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  height: 40;
  margin-top: 20;
  margin-left: 20;
  margin-right: 20;
  margin-bottom: 20;
  border-width: 1;
  border-radius: 15;
  border-color: #fee6d0;
  background-color: #fee6d0;
  align-items: center;
  justify-content: space-between;
`;

const SearchImg = styled.View`
  margin-right: 10px;
`;

const SearchResult = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  flex: 1;
  padding-left: 20px;
  /* padding-right: 10px; */
  padding-bottom: 20px;
  padding-top: 15px;
`;

const Input = styled.TextInput`
  margin-left: 15px;
  width: 85%;
`;

// show Search
const SearchPresenter = ({
  loading,
  jejuResult,
  searchTerm,
  onSubmitEditing,
  handleSearchUpdate,
}) => (
  <Container>
    <SearchContainer>
      <Input
        onChangeText={handleSearchUpdate}
        value={searchTerm}
        autoFocus
        returnKeyType={'search'}
        placeholder="제주 맛집"
        placeholderTextColor={GREY_COLOR2}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={false}
      />

      <SearchImg>
        <Ionicons
          size={30}
          name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
          color={`${BLACK_COLOR}`}
        />
      </SearchImg>
    </SearchContainer>
    <SearchResult>
      {loading ? (
        <Loader />
      ) : (
        <>
          {jejuResult ? (
            jejuResult.length > 0 ? (
              <Section horizontal={false} title="">
                {jejuResult
                  .filter(list => list.id !== null)
                  .map(list => (
                    <SubSlide
                      tag={'tag'}
                      horizontal={false}
                      key={list.id}
                      id={list.id}
                      backgroundPoster={
                        list.matched_content_images[0].full_filename
                      }
                      poster={list.matched_content_images}
                      title={list.title}
                      overview={list.description}
                      detail={list.detail}
                      tagName={list.category.parent.category_name}
                      avg={list.like_count}
                    />
                  ))}
              </Section>
            ) : (
              <SearchNo text={'검색결과가 없습니다.'} />
            )
          ) : null}
        </>
      )}
    </SearchResult>
  </Container>
);

SearchPresenter.prototype = {
  loading: PropTypes.bool.isRequired,
  jejuResult: PropTypes.array,
  foodResult: PropTypes.array,
  playResult: PropTypes.array,
  seeResult: PropTypes.array,
  searchTerm: PropTypes.string,
  handleSearchUpdate: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
};

export default SearchPresenter;
