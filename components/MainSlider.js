import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Swiper from 'react-native-swiper';
import MainSlide from './MainSlide';
import Layout from '../constants/Layout';

const SWIPER_HEIGHT = Layout.height / 4;

const View = styled.View`
  border-radius: 15;
  height: ${SWIPER_HEIGHT};
  position: absolute;
`;

const Text = styled.Text``;

const MainSlider = ({mainList}) =>
  mainList ? (
    <Swiper
      marginBottom={20}
      showsPagination={false}
      autoplay={true}
      autoplayTimeout={3}
      style={{height: Layout.height / 4, marginTop: 15}}>
      {mainList
        .filter(list => list.id !== null)
        .map(list => (
          <View key={list.id}>
            <MainSlide
              id={list.id}
              backgroundPoster={list.matched_content_images[0].full_filename}
              poster={list.matched_content_images}
              title={list.title}
              overview={list.description}
              detail={list.detail}
              avg={list.like_count}
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
