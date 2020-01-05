import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Swiper from 'react-native-swiper';
import Layout from '../constants/Layout';
import MainSlide from './MainSlide';

const SWIPER_HEIGHT = Layout.height / 4;

const View = styled.View`
  border-radius: 15;
  height: ${SWIPER_HEIGHT};
  position: absolute;
`;

const Text = styled.Text``;

const MainSlider = ({movies}) =>
  movies ? (
    <Swiper
      marginBottom={20}
      showsPagination={false}
      autoplay={true}
      autoplayTimeout={3}
      style={{height: Layout.height / 4, marginTop: 15}}>
      {movies
        .filter(movie => movie.backdrop_path !== null)
        .map(movie => (
          <View key={movie.id}>
            <MainSlide
              overview={movie.overview}
              avg={movie.vote_average}
              title={movie.title}
              id={movie.id}
              backgroundPoster={movie.backdrop_path}
              poster={movie.poster_path}
            />
          </View>
        ))}
    </Swiper>
  ) : (
    <View>
      <Text>NULL</Text>
    </View>
  );

MainSlider.prototype = {
  movies: PropTypes.array,
};
export default MainSlider;
