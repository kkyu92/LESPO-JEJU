import React from 'react';
import {withNavigation} from 'react-navigation';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PhotoUri from '../api/PhotoUri';
import Layout from '../constants/Layout';
import Poster from './Poster';
import {
  TINT_COLOR,
  GREY_COLOR,
  GREY_COLOR3,
  BG_COLOR,
} from '../constants/Colors';
import Like from './Like';
import GetPhoto from '../api/GetPhoto';

// 메인슬라이드 - 컨테이너
const Container = styled.TouchableOpacity`
  border-radius: 15;
  flex: 1;
  background-color: black;
  position: relative;
`;

// 메인슬라이드 - 배경
const BGImage = styled.Image`
  border-radius: 15;
  width: ${Layout.width - 40};
  height: ${Layout.height / 4};
  /* opacity: 0.4; */
  position: absolute;
`;

// blank
const Blank = styled.View`
  flex: 2;
`;

// opacity
const Opacity = styled.View`
  border-bottom-left-radius: 15;
  border-bottom-right-radius: 15;
  align-items: flex-start;
  width: ${Layout.width - 40};
  height: 80px;
  justify-content: flex-start;
  background-color: black;
  opacity: 0.5;
`;

// 먹거리슬라이드 - 이미지
const Content = styled.View`
  flex: 1;
  border-radius: 15;
  align-items: flex-start;
  /* padding-left: 20px;
  padding-right: 20px; */
  justify-content: center;
  /* background-color: black;
  opacity: 0.5; */
`;

// 메인슬라이드 - 문자 컨테이너
const Column = styled.View`
  flex: 5;
  align-items: flex-start;
  padding-left: 20px;
  padding-right: 20px;
`;

// 메인슬라이드 - 제목 텍스트
const Title = styled.Text`
  color: ${TINT_COLOR};
  font-size: 14px;
  font-weight: 600;
`;

// 메인슬라이드 - 내용 텍스트
const Overview = styled.Text`
  color: ${TINT_COLOR};
  font-size: 12px;
`;

const TextContainer = styled.View`
  flex-direction: row;
  position: absolute;
  padding-right: 20px;
`;

const LikeContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-right: 20px;
  margin-left: 20px;
`;
const ItemTextContainer = styled.View`
  justify-content: center;
  align-content: center;
  width: ${(Layout.width / 3) * 2 - 40};
  margin-top: 40px;
  margin-bottom: 20px;
  padding-right: 10px;
  padding-left: 10px;
  background-color: ${TINT_COLOR};
`;
const ItemLikeContainer = styled.View`
  position: absolute;
  flex-direction: row;
  padding: 5px;
  right: 0;
  background-color: ${BG_COLOR};
  border-radius: 10px;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
`;
const ItemImg = styled.Image`
  width: ${Layout.width / 3};
  height: ${(Layout.width / 5) * 3};
`;
const ItemTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
`;
const ItemContents = styled.Text`
  font-size: 14px;
  color: ${GREY_COLOR3};
`;
const LikeImg = styled.Image`
  width: 30px;
  height: 30px;
`;
const LikeText = styled.Text`
  color: ${TINT_COLOR};
  margin-left: 5px;
`;

// 서버에서 이미지를 불러올때(uri) width, height 지정해줘야함
const MainSlide = ({
  map = false,
  id,
  poster,
  backgroundPoster,
  title,
  avg,
  overview,
  detail,
  navigation,
}) =>
  map ? (
    <ItemContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'Detail',
          params: {
            id,
            backgroundPoster,
            poster,
            title,
            avg,
            overview,
            detail,
          },
        })
      }>
      <ItemImg source={{uri: GetPhoto(backgroundPoster)}} />
      <ItemTextContainer>
        <ItemTitle numberOfLines={1}>{title}</ItemTitle>
        <ItemContents numberOfLines={5}>{overview}</ItemContents>
      </ItemTextContainer>
      <ItemLikeContainer>
        <LikeImg
          source={require(`../assets/drawable-xxhdpi/icon_like_wh.png`)}
        />
        <LikeText>{avg}</LikeText>
      </ItemLikeContainer>
    </ItemContainer>
  ) : (
    <Container
      onPress={() =>
        navigation.navigate({
          routeName: 'Detail',
          params: {
            id,
            backgroundPoster,
            title,
            avg,
            overview,
          },
        })
      }>
      <BGImage source={{uri: PhotoUri(backgroundPoster)}} />
      <Blank />
      <Content>
        <Opacity />
        {/* <Poster path={poster} /> */}
        <TextContainer>
          <Column>
            <Title numberOfLines={1}>{title}</Title>
            {overview ? (
              <Overview numberOfLines={2}>
                {overview}
                {/* {overview.length > 57
              ? `${overview.substring(0, 60)}...`
              : overview} */}
              </Overview>
            ) : null}
            {/* <Btn text={"MORE DETAIL"} /> */}
          </Column>
          {avg ? (
            <LikeContainer>
              <Like votes={avg} inSlide={true} />
            </LikeContainer>
          ) : null}
        </TextContainer>
      </Content>
    </Container>
  );

// MainSlide.propTypes = {
//   id: PropTypes.number.isRequired,
//   poster: PropTypes.string.isRequired,
//   backgroundPoster: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   avg: PropTypes.number.isRequired,
//   overview: PropTypes.string.isRequired
// };

export default withNavigation(MainSlide);
