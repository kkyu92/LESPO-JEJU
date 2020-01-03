import React from 'react';
import styled from 'styled-components';
import {withNavigation} from 'react-navigation';
import Poster from './Poster';
import Like from './Like';
import {
  BG_COLOR,
  TINT_COLOR,
  GREY_COLOR,
  BLACK_COLOR,
} from '../constants/Colors';
import PhotoUri from '../api/PhotoUri';
import Layout from '../constants/Layout';

function ChangeColor() {
  let ColorCode =
    'rgb(' +
    Math.floor(Math.random() * 256) +
    ',' +
    Math.floor(Math.random() * 256) +
    ',' +
    Math.floor(Math.random() * 256) +
    ')';
  return ColorCode;
}

const Container = styled.TouchableOpacity`
  width: 110px;
  height: 160px;
  border-radius: 15;
  margin-right: 10px;
  position: relative;
`;

const BackColor = styled.View`
  width: 110px;
  height: 160px;
  align-items: center;
  justify-content: center;
  border-radius: 15;
`;

const FoodImg = styled.Image`
  width: 100px;
  height: 150px;
  border-radius: 15;
`;

const LikeConatiner = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
`;

const TextContainer = styled.View`
  border-bottom-left-radius: 15;
  border-bottom-right-radius: 15;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  align-self: stretch;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Title = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

const Context = styled.Text`
  color: ${TINT_COLOR};
  font-size: 8px;
`;

const VerticalContainer = styled.TouchableOpacity`
  padding-top: 10px;
  padding-bottom: 10px;
  flex-direction: row;
  border-color: ${GREY_COLOR};
  border-bottom-width: 0.5;
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;
`;

const VerticalColum = styled.View`
  width: 40%;
`;

const VerticalTitle = styled.Text`
  color: ${BLACK_COLOR};
  font-size: 14px;
  font-weight: 800;
  margin-vertical: 5px;
`;

const VerticalContext = styled.Text`
  font-size: 12px;
  color: ${BLACK_COLOR};
`;

const VerticalImgContainer = styled.View`
  width: 150px;
  height: 120px;
  border-radius: 15;
  align-items: flex-end;
`;

const VerticalImg = styled.Image`
  width: 150px;
  height: 120px;
  border-radius: 15;
  position: absolute;
`;

const RecommendImgContainer = styled.View`
  width: ${Layout.width / 3};
  height: ${Layout.height / 8};
  border-radius: 15;
  align-items: flex-end;
`;
const RecommendImg = styled.Image`
  width: ${Layout.width / 3};
  height: ${Layout.height / 8};
  border-radius: 15;
  position: absolute;
`;

const ADContainer = styled.View`
  width: 100%;
  height: 120px;
  border-radius: 15;
  align-items: flex-end;
`;
const ADImg = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: 15;
`;

// TODO: Search 부분에서 사용 TAG
const TagImg = styled.Text`
  background-color: ${TINT_COLOR};
  color: ${BG_COLOR};
  border-radius: 10;
  border-color: ${BG_COLOR};
  border-width: 1;
  text-align: center;
  padding-vertical: 2px;
  padding-horizontal: 6px;
  margin: 4px;
`;

// 상세보기 버튼
const DetailBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${BG_COLOR};
  padding: 8px;
`;
const DetailText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 12px;
`;

// 리스트 기본틀
const SubSlide = ({
  id,
  backgroundPoster,
  title,
  avg,
  overview,
  horizontal = true,
  tag = 'tag',
  navigation,
}) =>
  horizontal ? (
    // 가로로 슬라이드
    <Container
      onPress={() =>
        navigation.navigate({
          routeName: 'Detail',
          params: {id, backgroundPoster, title, avg, overview, tag},
        })
      }>
      {/* <Poster path={poster} /> */}
      <BackColor backgroundColor={ChangeColor()}>
        <FoodImg source={{uri: PhotoUri(backgroundPoster)}} />
      </BackColor>
      <LikeConatiner>
        <Like votes={avg} inSlide={true} />
      </LikeConatiner>
      <TextContainer>
        <Title numberOfLines={1}>
          {title.length > 15 ? `${title.substring(0, 12)}...` : title}
        </Title>
        {overview ? (
          <Context numberOfLines={1}>
            {overview.length > 15
              ? `${overview.substring(0, 12)}...`
              : overview}
          </Context>
        ) : null}
      </TextContainer>
    </Container>
  ) : tag === 'tag' ? (
    // 세로로 슬라이드 + TAG [ 관광상품 ]
    <VerticalContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'Detail',
          params: {id, backgroundPoster, title, avg, overview, tag},
        })
      }>
      <VerticalImgContainer>
        <VerticalImg source={{uri: PhotoUri(backgroundPoster)}} />
        <TagImg>먹거리</TagImg>
      </VerticalImgContainer>
      <VerticalColum>
        <VerticalTitle numberOfLines={1}>{title}</VerticalTitle>
        <VerticalContext numberOfLines={5}>
          {overview.length > 115
            ? `${overview.substring(0, 112)}...`
            : overview}
        </VerticalContext>
      </VerticalColum>
      <Like votes={avg} inSlide={false} />
    </VerticalContainer>
  ) : tag === 'notag' ? (
    // 세로로 슬라이드 - TAG [ 여행하기 ]
    <VerticalContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'Detail',
          params: {id, backgroundPoster, title, avg, overview, tag},
        })
      }>
      <VerticalImgContainer>
        <VerticalImg source={{uri: PhotoUri(backgroundPoster)}} />
      </VerticalImgContainer>
      <VerticalColum>
        <VerticalTitle numberOfLines={1}>{title}</VerticalTitle>
        <VerticalContext numberOfLines={5}>
          {overview.length > 115
            ? `${overview.substring(0, 112)}...`
            : overview}
        </VerticalContext>
      </VerticalColum>
      <Like votes={avg} inSlide={false} />
    </VerticalContainer>
  ) : tag === 'recommend' ? (
    // 추천관광 - [ 상세보기 ]
    <VerticalContainer>
      <RecommendImgContainer>
        <RecommendImg source={{uri: PhotoUri(backgroundPoster)}} />
      </RecommendImgContainer>
      <VerticalColum>
        <VerticalTitle numberOfLines={1}>{title}</VerticalTitle>
        <VerticalContext numberOfLines={5}>
          {overview.length > 115
            ? `${overview.substring(0, 112)}...`
            : overview}
        </VerticalContext>
      </VerticalColum>
      <DetailBtn
        onPress={() =>
          navigation.navigate({
            routeName: 'Detail',
            params: {id, backgroundPoster, title, avg, overview, tag},
          })
        }>
        <DetailText>상세보기</DetailText>
      </DetailBtn>
    </VerticalContainer>
  ) : (
    // 세로로 슬라이드 - Image [ 제주의 소리 ]
    <VerticalContainer
      onPress={() =>
        navigation.navigate({
          routeName: 'Detail',
          params: {id, backgroundPoster, title, avg, overview, tag},
        })
      }>
      <ADContainer>
        <ADImg source={{uri: PhotoUri(backgroundPoster)}} />
      </ADContainer>
    </VerticalContainer>
  );

export default withNavigation(SubSlide);
