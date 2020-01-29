import React from 'react';
import {withNavigation} from 'react-navigation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import styled from 'styled-components';
import Loader from '../../components/Loader';
import {
  TINT_COLOR,
  GREY_COLOR3,
  GREY_COLOR2,
  BG_COLOR,
  GREY_COLOR,
} from '../../constants/Colors';
import Layout from '../../constants/Layout';
import MyLocationIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Fontisto';
import Swiper from 'react-native-swiper';
import MainSlide from '../../components/MainSlide';
import {Callout} from 'react-native-maps';

// var map = React.createRef();
// var swiper = React.createRef();

const MapContainer = styled.View`
  width: ${Layout.width};
  height: ${Layout.height};
  background-color: ${TINT_COLOR};
  position: absolute;
`;
const ListContainer = styled.View`
  flex-direction: row;
  position: absolute;
  background-color: rgba(0, 0, 0, 0);
  width: 80%;
  height: ${Layout.height / 5};
  top: 50px;
  margin: 20px;
  border-radius: 25px;
  align-self: center;
  justify-content: center;
`;
const ListBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${Layout.width / 5};
  height: ${Layout.width / 5};
  border-radius: ${Layout.width / 10};
  border-width: 1px;
  border-color: ${GREY_COLOR};
  background-color: ${TINT_COLOR};
  margin: 10px;
`;
const ListText = styled.Text`
  text-align: center;
  color: ${GREY_COLOR};
`;

const ListBtnCheck = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${Layout.width / 5};
  height: ${Layout.width / 5};
  border-radius: ${Layout.width / 10};
  border-width: 1px;
  border-color: ${BG_COLOR};
  background-color: ${TINT_COLOR};
  margin: 10px;
`;
const ListTextCheck = styled.Text`
  text-align: center;
  color: ${BG_COLOR};
`;

const MyLocation = styled.TouchableOpacity`
  position: absolute;
  background-color: ${TINT_COLOR};
  width: 50px;
  height: 50px;
  right: 0;
  bottom: 30px;
  margin: 20px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  /* padding:10px; */
`;
const SWIPER_HEIGHT = (Layout.width / 5) * 3;
const MView = styled.View`
  border-radius: 15;
  height: ${(Layout.width / 5) * 3};
  margin-top: ${Layout.height - SWIPER_HEIGHT};
`;
const VIEW_HEIGHT = Layout.height / 4;
const View = styled.View`
  border-radius: 15;
  height: ${VIEW_HEIGHT};
  position: absolute;
`;

const _getLocation = async (latitude, longitude) => {
  this.map.animateToRegion(
    {latitude, longitude, latitudeDelta: 0.09, longitudeDelta: 0.035},
    1000,
  );
  this.marker.showCallout();
};

let INDEX = 0;
const coordinates = {
  mark: [],
  markers: [
    {
      key: 0,
      name: '제주공항',
      text: '제주공항 설명',
      latlng: {latitude: 33.5104135, longitude: 126.4891594},
    },
    {
      key: 1,
      name: '한라산',
      text: '한라산 설명',
      latlng: {latitude: 33.3616649, longitude: 126.5116141},
    },
    {
      key: 2,
      name: '라마다프라자 제주호텔',
      text: '제주특별자치도 제주시 삼도2동 탑동로 66',
      latlng: {latitude: 33.5185371, longitude: 126.5169538},
    },
    {
      key: 3,
      name: '문강사',
      text: '제주특별자치도 제주시 삼양일동',
      latlng: {latitude: 33.526218, longitude: 126.596241},
    },
    {
      key: 4,
      name: '세화 해수욕장',
      text: '제주시 구좌읍',
      latlng: {latitude: 33.5185371, longitude: 126.8435592},
    },
    {
      key: 5,
      name: '서귀포해양도립공원',
      text: '제주특별자치도 서귀포시 서홍동 707',
      latlng: {latitude: 33.246336, longitude: 126.2788065},
    },
    {
      key: 6,
      name: '제주동백수목원',
      text: '제주특별자치도 서귀포시 남원읍 위미리 929 제주특별자치도',
      latlng: {latitude: 33.2752541, longitude: 126.6758166},
    },
    {
      key: 7,
      name: '도두봉',
      text: '제주시 도두일동',
      latlng: {latitude: 33.5080933, longitude: 126.4510405},
    },
    {
      key: 8,
      name: '제주도 민속자연사박물관',
      text: '제주특별자치도 제주시 일도2동 삼성로 40',
      latlng: {latitude: 33.5064642, longitude: 126.5294241},
    },
    {
      key: 9,
      name: '제주특별자치도립미술관',
      text: '제주특별자치도 제주시 특별자치도, 1100로 2894-78 KR',
      latlng: {latitude: 33.4526324, longitude: 126.4874133},
    },
  ],
};

const onSwiperItemChange = (index, locations) => {
  INDEX = index;
  console.log(JSON.stringify(locations.locations));
  console.log(INDEX + ' :::onSwiperItemChange::: ' + index);
  // let location = coordinates.markers[index];
  let location = locations.locations[index].location;
  console.log('latlng ::: ' + location.latitude + ', ' + location.longitude);
  this.map.animateToRegion({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });
  locations.mark[index].showCallout();
};

const onMarkerPressed = locations => {
  this.map.animateToRegion({
    latitude: locations.location.latitude,
    longitude: locations.location.longitude,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });
  let moveIndex = locations.key - INDEX;
  console.log('index::: ' + locations.key);
  console.log('INDEX::: ' + moveIndex);
  // this.swiper.scrollBy(moveIndex, true);
};

const onCalloutPress = (listChanged, key, navigation) => {
  let id = listChanged[key].id;
  let backgroundPoster =
    listChanged[key].matched_content_images[0].full_filename;
  let poster = listChanged[key].matched_content_images;
  let title = listChanged[key].title;
  let avg = listChanged[key].like_count;
  let overview = listChanged[key].description;
  let detail = listChanged[key].detail;
  let isLike = listChanged[key].is_liked_count;
  let isWish = listChanged[key].is_wishlist_added_count;
  let comments = listChanged[key].comments;
  let likeId = listChanged[key].like_id;
  let wishId = listChanged[key].wishlist_id;

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
      isWish,
      isLike,
      comments,
      wishId,
      likeId,
    },
  });
};

const MapPresenter = ({
  loading,
  latitude,
  longitude,
  listChanged,
  locations,
  mainState,
  onListChanging,
  listName,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : mainState === 'map' ? (
    <MapContainer>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={map => (this.map = map)}
        // showsMyLocationButton
        showsUserLocation
        style={{
          width: Layout.width,
          height: Layout.height,
          position: 'absolute',
        }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        }}>
        {locations
          ? locations.locations
              .filter(list => list.key !== null)
              .map((list, index) => (
                <Marker
                  key={list.key}
                  ref={marker => (this.marker = marker)}
                  onPress={() => onMarkerPressed(list)}
                  onCalloutPress={() =>
                    onCalloutPress(listChanged, list.key, navigation)
                  }
                  coordinate={list.location}
                  title={list.title}
                  description={list.address}
                  show
                />
              ))
          : console.log('locations null ????? ' + JSON.stringify(locations))}
      </MapView>
      <MyLocation onPress={() => _getLocation(latitude, longitude)}>
        <MyLocationIcon
          size={30}
          name={'my-location'}
          color={`${GREY_COLOR3}`}
        />
      </MyLocation>
      <ListContainer>
        {listName === '' || listName === 'food' ? (
          <>
            <ListBtnCheck onPress={() => onListChanging('food')}>
              <Icon
                size={30}
                name={'silverware-fork-knife'}
                color={`${BG_COLOR}`}
              />
              <ListTextCheck>먹거리</ListTextCheck>
            </ListBtnCheck>
            <ListBtn onPress={() => onListChanging('view')}>
              <Icon size={30} name={'eye'} color={`${GREY_COLOR}`} />
              <ListText>볼거리</ListText>
            </ListBtn>
            <ListBtn onPress={() => onListChanging('play')}>
              <IconF
                size={30}
                name={'hot-air-balloon'}
                color={`${GREY_COLOR}`}
              />
              <ListText>놀거리</ListText>
            </ListBtn>
          </>
        ) : listName === 'view' ? (
          <>
            <ListBtn onPress={() => onListChanging('food')}>
              <Icon
                size={30}
                name={'silverware-fork-knife'}
                color={`${GREY_COLOR}`}
              />
              <ListText>먹거리</ListText>
            </ListBtn>
            <ListBtnCheck onPress={() => onListChanging('view')}>
              <Icon size={30} name={'eye'} color={`${BG_COLOR}`} />
              <ListTextCheck>볼거리</ListTextCheck>
            </ListBtnCheck>
            <ListBtn onPress={() => onListChanging('play')}>
              <IconF
                size={30}
                name={'hot-air-balloon'}
                color={`${GREY_COLOR}`}
              />
              <ListText>놀거리</ListText>
            </ListBtn>
          </>
        ) : (
          <>
            <ListBtn onPress={() => onListChanging('food')}>
              <Icon
                size={30}
                name={'silverware-fork-knife'}
                color={`${GREY_COLOR}`}
              />
              <ListText>먹거리</ListText>
            </ListBtn>
            <ListBtn onPress={() => onListChanging('view')}>
              <Icon size={30} name={'eye'} color={`${GREY_COLOR}`} />
              <ListText>볼거리</ListText>
            </ListBtn>
            <ListBtnCheck onPress={() => onListChanging('play')}>
              <IconF size={30} name={'hot-air-balloon'} color={`${BG_COLOR}`} />
              <ListTextCheck>놀거리</ListTextCheck>
            </ListBtnCheck>
          </>
        )}
      </ListContainer>
      {/* {listChanged.map(list => console.log(list.backdrop_path))} */}
    </MapContainer>
  ) : (
    <MapContainer>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={map => (this.map = map)}
        // showsMyLocationButton
        showsUserLocation
        style={{
          width: Layout.width,
          height: Layout.height,
          position: 'absolute',
        }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        }}>
        {locations
          ? locations.locations
              .filter(list => list.key !== null)
              .map((list, index) => (
                <Marker
                  key={list.key}
                  ref={marker => (locations.mark[index] = marker)}
                  onPress={() => onMarkerPressed(list)}
                  coordinate={list.location}
                  title={list.title}
                  description={list.address}
                />
              ))
          : console.log('locations null ????? ' + JSON.stringify(locations))}
      </MapView>
      <MyLocation onPress={() => _getLocation(latitude, longitude)}>
        <MyLocationIcon
          size={30}
          name={'my-location'}
          color={`${GREY_COLOR3}`}
        />
      </MyLocation>
      {/* {listChanged.map(list => console.log(list.backdrop_path))} */}
      <MView>
        <Swiper
          ref={swiper => {
            this.swiper = swiper;
          }}
          showsPagination={true}
          autoplay={false}
          autoplayTimeout={3}
          onIndexChanged={index => onSwiperItemChange(index, locations)}
          style={{
            height: (Layout.width / 5) * 3,
            position: 'absolute',
            bottom: 20,
          }}>
          {listChanged
            .filter(list => list.id !== null)
            .map((list, index) => (
              <View key={index}>
                <MainSlide
                  map={true}
                  overview={list.description}
                  avg={list.vote_average}
                  title={list.title}
                  id={list.id}
                  backgroundPoster={
                    list.matched_content_images[0].full_filename
                  }
                  poster={list.matched_content_images}
                  detail={list.detail}
                />
              </View>
            ))}
        </Swiper>
      </MView>
    </MapContainer>
  );

export default withNavigation(MapPresenter);
