import React from 'react';
import {withNavigation} from 'react-navigation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import styled from 'styled-components';
import Loader from '../../components/Loader';
import {TINT_COLOR, GREY_COLOR3} from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import MainSlide from '../../components/MainSlide';

const MapContainer = styled.View`
  width: ${Layout.width};
  height: ${Layout.height};
  background-color: ${TINT_COLOR};
  position: absolute;
`;

const MyLocation = styled.TouchableOpacity`
  position: absolute;
  background-color: ${TINT_COLOR};
  width: 50px;
  height: 50px;
  right: 0;
  top: 50px;
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

const onSwiperItemChange = (index, list) => {
  INDEX = index;
  console.log(INDEX + ' :::onSwiperItemChange::: ' + index);
  let location = coordinates.markers[index];
  console.log(
    'latlng ::: ' + location.latlng.latitude + ', ' + location.latlng.longitude,
  );
  this.map.animateToRegion({
    latitude: location.latlng.latitude,
    longitude: location.latlng.longitude,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });
  coordinates.mark[index].showCallout();
};

const onMarkerPressed = location => {
  this.map.animateToRegion({
    latitude: location.latlng.latitude,
    longitude: location.latlng.longitude,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });
  let moveIndex = location.key - INDEX;
  console.log('index::: ' + location.key);
  console.log('INDEX::: ' + moveIndex);
  this.swiper.scrollBy(moveIndex, true);
};

const MapPresenter = ({
  loading,
  latitude,
  longitude,
  listChanged,
  navigation,
}) =>
  loading ? (
    <Loader />
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
        {coordinates.markers.map((list, index) => (
          <Marker
            key={list.key}
            ref={marker => (coordinates.mark[index] = marker)}
            onPress={() => onMarkerPressed(list)}
            coordinate={list.latlng}
            title={list.name}
            description={list.text}
          />
        ))}
      </MapView>
      <MyLocation onPress={() => _getLocation(latitude, longitude)}>
        <Icon size={30} name={'my-location'} color={`${GREY_COLOR3}`} />
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
          onIndexChanged={index => onSwiperItemChange(index, listChanged)}
          style={{
            height: (Layout.width / 5) * 3,
            position: 'absolute',
            bottom: 20,
          }}>
          {listChanged
            .filter(movie => movie.backdrop_path !== null)
            .map(movie => (
              <View key={movie.id}>
                <MainSlide
                  map={true}
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
      </MView>
    </MapContainer>
  );

export default withNavigation(MapPresenter);
