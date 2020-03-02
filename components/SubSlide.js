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
  PURPLE_COLOR,
  GREEN_COLOR,
  GREY_COLOR3,
  BLUE,
} from '../constants/Colors';
import PhotoUri from '../api/PhotoUri';
import Layout from '../constants/Layout';
import GetPhoto from '../api/GetPhoto';

function ChangeColor() {
  const ColorCode =
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

const NullFoodImg = styled.Image`
  width: 80px;
  height: 80px;
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
  margin-top: 5px;
  margin-bottom: 5px;
`;

const VerticalContext = styled.Text`
  font-size: 12px;
  color: ${BLACK_COLOR};
`;

const VerticalImgContainer = styled.View`
  width: ${Layout.width / 2.7};
  height: ${Layout.height / 7};
  border-radius: 15;
  align-items: flex-end;
  background-color: ${GREY_COLOR};
`;
const NullImgContainer = styled.View`
  width: ${Layout.width / 2.7};
  height: ${Layout.height / 7};
  border-radius: 15;
  align-items: center;
  justify-content: center;
  background-color: ${GREY_COLOR};
  position: absolute;
`;

const NullImg = styled.Image`
  width: ${Layout.width / 5};
  height: ${Layout.width / 5};
  position: absolute;
`;

const VerticalImg = styled.Image`
  width: ${Layout.width / 2.7};
  height: ${Layout.height / 7};
  border-radius: 15;
  position: absolute;
`;

const RecommendImgContainer = styled.View`
  width: ${Layout.width / 2.7};
  height: ${Layout.height / 7};
  border-radius: 15;
  align-items: flex-end;
`;
const RecommendImg = styled.Image`
  width: ${Layout.width / 2.7};
  height: ${Layout.height / 7};
  border-radius: 15;
  position: absolute;
`;

const ADContainer = styled.View`
  width: 100%;
  height: 120px;
  border-radius: 15;
  align-items: flex-end;
  align-items: center;
  justify-content: center;
  background-color: ${GREY_COLOR};
`;
const NullADImg = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 15;
`;
const ADImg = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: 15;
`;

// TODO: Search 부분에서 사용 TAG
const TagContainer = styled.View`
  background-color: ${TINT_COLOR};
  border-radius: 15;
  border-color: ${BG_COLOR};
  border-width: 1;
  margin: 4px;
`;
const TagImg = styled.Text`
  color: ${BG_COLOR};
  text-align: center;
  padding: 2px;
  margin: 4px;
`;
const TagViewContainer = styled.View`
  background-color: ${TINT_COLOR};
  border-radius: 15;
  border-color: ${PURPLE_COLOR};
  border-width: 1;
  margin: 4px;
`;
const TagViewImg = styled.Text`
  color: ${PURPLE_COLOR};
  text-align: center;
  padding: 2px;
  margin: 4px;
`;
const TagPlayContainer = styled.View`
  background-color: ${TINT_COLOR};
  border-radius: 15;
  border-color: ${GREEN_COLOR};
  border-width: 1;
  margin: 4px;
`;
const TagPlayImg = styled.Text`
  color: ${GREEN_COLOR};
  text-align: center;
  padding: 2px;
  margin: 4px;
`;
const TagRecoContainer = styled.View`
  background-color: ${TINT_COLOR};
  border-radius: 15;
  border-color: ${BLUE};
  border-width: 1;
  margin: 4px;
`;
const TagRecoImg = styled.Text`
  color: ${BLUE};
  text-align: center;
  padding: 2px;
  margin: 4px;
`;
const TagOtherContainer = styled.View`
  background-color: ${TINT_COLOR};
  border-radius: 15;
  border-color: ${GREY_COLOR3};
  border-width: 1;
  margin: 4px;
`;
const TagOtherImg = styled.Text`
  color: ${GREY_COLOR3};
  text-align: center;
  padding: 2px;
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
  poster,
  title,
  overview,
  detail,
  avg,
  horizontal = true,
  tag = 'tag',
  tagName,
  markerOn,
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
        {backgroundPoster === 'no' ? (
          <NullFoodImg
            source={require(`../assets/drawable-xxhdpi/img_noimage.png`)}
          />
        ) : (
          <FoodImg source={{uri: GetPhoto(backgroundPoster)}} />
        )}
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
          params: {
            id,
            backgroundPoster,
            poster,
            title,
            avg,
            overview,
            tag,
            detail,
          },
        })
      }>
      <VerticalImgContainer>
        {backgroundPoster === 'no' ? (
          <NullImgContainer>
            <NullImg
              source={require(`../assets/drawable-xxhdpi/img_noimage.png`)}
            />
          </NullImgContainer>
        ) : (
          <VerticalImg source={{uri: GetPhoto(backgroundPoster)}} />
        )}
        {tagName === '먹거리' ? (
          <TagContainer>
            <TagImg>먹거리</TagImg>
          </TagContainer>
        ) : tagName === '놀거리' ||
          tagName === '운동시설' ||
          tagName === '레저스포츠' ? (
          <TagPlayContainer>
            <TagPlayImg>놀거리</TagPlayImg>
          </TagPlayContainer>
        ) : tagName === '볼거리' ? (
          <TagViewContainer>
            <TagViewImg>볼거리</TagViewImg>
          </TagViewContainer>
        ) : tagName === '시설' ? (
          <TagOtherContainer>
            <TagOtherImg>추 천</TagOtherImg>
          </TagOtherContainer>
        ) : (
          <TagRecoContainer>
            <TagRecoImg>추 천</TagRecoImg>
          </TagRecoContainer>
        )}
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
          params: {
            id,
            backgroundPoster,
            poster,
            title,
            avg,
            overview,
            tag,
            detail,
          },
        })
      }>
      <VerticalImgContainer>
        {backgroundPoster === 'no' ? (
          <NullImgContainer>
            <NullImg
              source={require(`../assets/drawable-xxhdpi/img_noimage.png`)}
            />
          </NullImgContainer>
        ) : (
          <VerticalImg source={{uri: GetPhoto(backgroundPoster)}} />
        )}
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
    <VerticalContainer onPress={() => markerOn(id)}>
      <RecommendImgContainer>
        {backgroundPoster === 'no' ? (
          <NullImgContainer>
            <NullImg
              source={require(`../assets/drawable-xxhdpi/img_noimage.png`)}
            />
          </NullImgContainer>
        ) : (
          <RecommendImg
            source={{
              uri: GetPhoto(backgroundPoster),
            }}
          />
        )}
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
            params: {
              id,
              backgroundPoster,
              title,
              avg,
              overview,
              tag,
              detail,
              reco: true,
            },
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
          params: {
            id,
            backgroundPoster,
            poster,
            title,
            avg,
            overview,
            tag,
            detail,
          },
        })
      }>
      <ADContainer>
        {backgroundPoster === 'no' ? (
          <NullADImg
            source={require(`../assets/drawable-xxhdpi/img_noimage.png`)}
          />
        ) : (
          <ADImg source={{uri: GetPhoto(backgroundPoster)}} />
        )}
      </ADContainer>
    </VerticalContainer>
  );

export default withNavigation(SubSlide);
