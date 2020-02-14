import React from 'react';
import {Text} from 'react-native';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../../components/Loader';
import styled from 'styled-components';
import MainSlider from '../../components/MainSlider';
import {Platform} from 'react-native';
import Section from '../../components/Section';
import SubSlide from '../../components/SubSlide';
import {
  BLACK_COLOR,
  GREY_COLOR,
  TINT_COLOR,
  BG_COLOR,
} from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Toast from 'react-native-easy-toast';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const SearchContainer = styled.TouchableOpacity`
  justify-content: space-between;
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
`;

const SearchText = styled.Text`
  margin-left: 10px;
  color: #9a9895;
`;

const SearchImg = styled.View`
  margin-right: 10px;
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

const Blank = styled.View`
  height: 20px;
`;

const IconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-top: 15px;
  margin-right: 60px;
  margin-left: 40px;
`;
const IconBattle = styled.Image`
  width: ${Layout.width / 4 + 40};
  height: ${Layout.width / 4};
`;
const IconTrip = styled.Image`
  width: ${Layout.width / 4 + 10};
  height: ${Layout.width / 4};
`;

const IconText = styled.Text`
  margin-top: 10px;
  color: ${GREY_COLOR};
`;

const TouchableContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  margin-top: ${Platform.OS === 'ios' ? '35px' : '15px'};
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  /* background-color: goldenrod; */
`;

const HeaderText = styled.Text`
  /* width: 40%; */
  color: ${TINT_COLOR};
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  /* background-color: gainsboro; */
`;

const RightButtonContainer = styled.View`
  position: absolute;
  right: 20px;
  top: ${Platform.OS === 'ios' ? '25px' : '15px'};
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  /* background-color: royalblue; */
`;

const WishListBtn = styled.TouchableOpacity`
  margin-right: 5px;
  padding: 5px;
  align-items: center;
  justify-content: center;
`;

const WishList = styled.Image`
  width: 26px;
  height: 22.4px;
`;
const Map = styled.Image`
  width: 21.6px;
  height: 26px;
`;

const MapBtn = styled.TouchableOpacity`
  padding: 5px;
  align-items: center;
  justify-content: center;
`;

const state = 'map';

// show DATA
const MainPresenter = ({
  loading,
  mainList,
  foodList,
  playList,
  viewList,
  toast,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <HeaderContainer>
        <HeaderText>제주배틀투어</HeaderText>
      </HeaderContainer>
      <RightButtonContainer>
        <WishListBtn
          onPress={() =>
            navigation.navigate({
              routeName: 'MyWishList',
            })
          }>
          <WishList
            source={require(`../../assets/drawable-xxxhdpi/icon_wish_wh.png`)}
          />
        </WishListBtn>
        <MapBtn
          onPress={() =>
            navigation.navigate({
              routeName: 'Map',
              params: {
                mainState: 'map',
              },
            })
          }>
          <Map
            source={require(`../../assets/drawable-xxxhdpi/icon_map_wh.png`)}
          />
        </MapBtn>
      </RightButtonContainer>
      <SearchContainer
        onPress={() =>
          navigation.navigate({
            routeName: 'Search',
          })
        }>
        <SearchText>여행정보를 검색해보세요.</SearchText>
        <SearchImg>
          <Icon
            size={30}
            name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
            color={`${BLACK_COLOR}`}
          />
        </SearchImg>
      </SearchContainer>
      <Container>
        <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
          제주에서 뭘 할까?
        </Text>

        <IconContainer>
          <TouchableContainer
            onPress={() =>
              navigation.navigate({
                routeName: 'SportsBattle',
              })
            }>
            <IconBattle
              source={require(`../../assets/drawable-xxhdpi/btn_ch_sb.png`)}
            />
            <IconText>스포츠 배틀</IconText>
          </TouchableContainer>

          <TouchableContainer
            onPress={() =>
              navigation.navigate({
                routeName: 'Trip',
              })
            }>
            <IconTrip
              source={require(`../../assets/drawable-xxhdpi/img_traveler.png`)}
            />
            <IconText>여행하기</IconText>
          </TouchableContainer>
        </IconContainer>

        <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
          레스포가 추천하는 제주맛집
        </Text>
        {mainList ? <MainSlider mainList={mainList} /> : null}

        {/*TODO: 먹거리 */}
        {foodList ? (
          <Section title="먹거리">
            {foodList.map(list => (
              <SubSlide
                key={list.id}
                id={list.id}
                backgroundPoster={list.matched_content_images[0].full_filename}
                poster={list.matched_content_images}
                title={list.title}
                overview={list.description}
                detail={list.detail}
                avg={list.like_count}
              />
            ))}
          </Section>
        ) : null}

        {/*TODO: 놀거리 */}
        {playList ? (
          <Section title="놀거리">
            {playList.map(list => (
              <SubSlide
                key={list.id}
                id={list.id}
                backgroundPoster={list.matched_content_images[0].full_filename}
                poster={list.matched_content_images}
                title={list.title}
                overview={list.description}
                detail={list.detail}
                avg={list.like_count}
              />
            ))}
          </Section>
        ) : null}

        {/*TODO: 볼거리 */}
        {viewList ? (
          <Section title="볼거리">
            {viewList.map(list => (
              <SubSlide
                key={list.id}
                id={list.id}
                backgroundPoster={list.matched_content_images[0].full_filename}
                poster={list.matched_content_images}
                title={list.title}
                overview={list.description}
                detail={list.detail}
                avg={list.like_count}
              />
            ))}
          </Section>
        ) : null}
        {/* <Text
          style={{
            color: "black",
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 20
          }}
        >
          먹거리
        </Text> */}
        <Blank />
      </Container>
    </View>
  );

//TODO: Flow.js -facebook
// MainPresenter.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   upComing: PropTypes.array,
//   popular: PropTypes.array,
//   nowPlaying: PropTypes.array
// };

export default withNavigation(MainPresenter);
