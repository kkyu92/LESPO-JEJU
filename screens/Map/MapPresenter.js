import React from 'react';
import {withNavigation, FlatList} from 'react-navigation';
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
import ZoomIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Fontisto';
import Swiper from 'react-native-swiper';
import SwiperFlatList from 'react-native-swiper-flatlist';
import MainSlide from '../../components/MainSlide';
import {Callout} from 'react-native-maps';
import {Text, StyleSheet, Platform} from 'react-native';

// var map = React.createRef();
// var swiper = React.createRef();
const styles = StyleSheet.create({
  callout: {
    backgroundColor: 'white',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  title: {
    color: 'black',
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
    // fontFamily: fonts.spoqaHanSansRegular,
  },
  description: {
    color: '#707070',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
    maxWidth: (Layout.width / 3) * 2,
    // fontFamily: fonts.spoqaHanSansRegular,
  },
});

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
  border-color: ${GREY_COLOR3};
  border-width: 1px;
  width: 50px;
  height: 50px;
  right: 0;
  top: 60px;
  margin: 20px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;
const ZoomIn = styled.TouchableOpacity`
  position: absolute;
  background-color: ${TINT_COLOR};
  border-color: ${GREY_COLOR3};
  border-width: 1px;
  width: 50px;
  height: 50px;
  right: 0;
  top: 120px;
  margin: 20px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;
const ZoomOut = styled.TouchableOpacity`
  position: absolute;
  background-color: ${TINT_COLOR};
  border-color: ${GREY_COLOR3};
  border-width: 1px;
  width: 50px;
  height: 50px;
  right: 0;
  top: 180px;
  margin: 20px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;
const ZoomInBottom = styled.TouchableOpacity`
  position: absolute;
  background-color: ${TINT_COLOR};
  border-color: ${GREY_COLOR3};
  border-width: 1px;
  width: 50px;
  height: 50px;
  right: 0;
  bottom: 150px;
  margin: 20px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;
const ZoomOutBottom = styled.TouchableOpacity`
  position: absolute;
  background-color: ${TINT_COLOR};
  border-color: ${GREY_COLOR3};
  border-width: 1px;
  width: 50px;
  height: 50px;
  right: 0;
  bottom: 90px;
  margin: 20px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;
const MyLocationBottom = styled.TouchableOpacity`
  position: absolute;
  background-color: ${TINT_COLOR};
  border-color: ${GREY_COLOR3};
  border-width: 1px;
  width: 50px;
  height: 50px;
  right: 0;
  bottom: 30px;
  margin: 20px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

const SWIPER_HEIGHT = (Layout.width / 5) * 3;
const MView = styled.View`
  border-radius: 15;
  height: ${(Layout.width / 5) * 3};
  width: 100%;
  margin-top: ${Layout.height - SWIPER_HEIGHT - 15};
`;
const VIEW_HEIGHT = Layout.height / 4;
const View = styled.View`
  border-radius: 15;
  height: ${VIEW_HEIGHT};
  position: absolute;
`;
const NoticeContainer = styled.View`
  position: absolute;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-color: ${BG_COLOR};
  border-width: 1px;
  background-color: ${TINT_COLOR};
  padding-top: ${Platform.OS === 'ios' ? 15 : 10};
  padding-bottom: ${Platform.OS === 'ios' ? 15 : 10};
  justify-content: center;
  align-items: center;
  align-self: center;
`;
const NoticeText = styled.Text`
  color: ${BG_COLOR};
  font-size: 15px;
  font-weight: 800;
  text-align: center;
`;

const _getLocation = async (latitude, longitude) => {
  console.log('lat: ' + latitude + '\nlon: ' + longitude);
  this.map.animateToRegion(
    {latitude, longitude, latitudeDelta: 0.035, longitudeDelta: 0.035},
    1000,
  );
  // this.marker.showCallout();
};
const _zoomIn = async (
  latitude,
  longitude,
  latDelta,
  lonDelta,
  latitudeMY,
  longitudeMY,
) => {
  let latitudeDelta = latDelta / 2;
  let longitudeDelta = lonDelta / 2;
  if (latitude !== null) {
    this.map.animateToRegion(
      {latitude, longitude, latitudeDelta, longitudeDelta},
      500,
    );
  } else {
    this.map.animateToRegion(
      {
        latitude: latitudeMY,
        longitude: longitudeMY,
        latitudeDelta,
        longitudeDelta,
      },
      500,
    );
  }
  // this.marker.showCallout();
};
const _zoomOut = async (
  latitude,
  longitude,
  latDelta,
  lonDelta,
  latitudeMY,
  longitudeMY,
) => {
  let latitudeDelta = latDelta + latDelta;
  let longitudeDelta = lonDelta + lonDelta;
  if (latitude !== null) {
    this.map.animateToRegion(
      {latitude, longitude, latitudeDelta, longitudeDelta},
      500,
    );
  } else {
    this.map.animateToRegion(
      {
        latitude: latitudeMY,
        longitude: longitudeMY,
        latitudeDelta,
        longitudeDelta,
      },
      500,
    );
  }
  // this.marker.showCallout();
};

let INDEX = 0;

const onSwiperItemChange = async (index, locations) => {
  INDEX = index;
  // console.log(JSON.stringify(locations.locations));
  console.log(INDEX + ' :::onSwiperItemChange::: ' + index);
  // let location = coordinates.markers[index];
  let location = locations.locations[index].location;
  console.log('latlng ::: ' + location.latitude + ', ' + location.longitude);
  await this.map.animateToRegion({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });
  console.log('index::: ' + index);
  if (index !== 0) {
    locations.mark[index].showCallout();
  }
};

const onSwiperItemChangeFlat = (index, locations) => {
  console.log('onSwiperItemChangeFlat ' + JSON.stringify(index));
  if (index.index !== index.prevIndex) {
    console.log('if');
    INDEX = index.index;
    console.log(INDEX + ' :::onSwiperItemChange::: ' + index.index);
    let location = locations.locations[index.index].location;
    console.log('latlng ::: ' + location.latitude + ', ' + location.longitude);
    this.map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
    locations.mark[index.index].showCallout();
  }
};

const onMarkerPressed = (locations, mainState) => {
  this.map.animateToRegion({
    latitude: locations.location.latitude,
    longitude: locations.location.longitude,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });

  if (mainState !== 'map') {
    console.log('마커클릭 인덱스: ' + locations.key);
    INDEX = locations.key;
  }
};

const onCalloutPress = (listChanged, key, navigation) => {
  let id = listChanged[key].id;
  let backgroundPoster, poster;
  if (JSON.stringify(listChanged[key].matched_content_images) === '[]') {
    backgroundPoster = 'no';
    poster = 'no';
  } else {
    backgroundPoster = listChanged[key].matched_content_images[0].full_filename;
    poster = listChanged[key].matched_content_images;
  }
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
  latitudeMY,
  longitudeMY,
  latitude,
  longitude,
  latDelta,
  lonDelta,
  listChanged,
  locations,
  mainState,
  onListChanging,
  onRegionChange,
  onSavePlace,
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
        rotateEnabled={false}
        onRegionChange={region => onRegionChange(region)}
        showsUserLocation
        style={{
          width: Layout.width,
          height: Layout.height,
          position: 'absolute',
        }}
        initialRegion={{
          latitude: latitudeMY,
          longitude: longitudeMY,
          latitudeDelta: latDelta,
          longitudeDelta: lonDelta,
        }}>
        {locations
          ? locations.locations
              .filter(list => list.key !== null)
              .map((list, index) => (
                <Marker
                  key={list.key}
                  ref={marker => (this.marker = marker)}
                  onPress={() => onMarkerPressed(list, mainState)}
                  onCalloutPress={() =>
                    onCalloutPress(listChanged, list.key, navigation)
                  }
                  coordinate={list.location}
                  title={list.title}
                  description={list.address}
                  show>
                  {Platform.OS === 'ios' ? (
                    <Callout
                      tooltip={true}
                      style={styles.callout}
                      onPress={() =>
                        onCalloutPress(listChanged, list.key, navigation)
                      }>
                      <Text style={styles.title}>{list.title}</Text>
                      <Text style={styles.description}>{list.address}</Text>
                    </Callout>
                  ) : null}
                </Marker>
              ))
          : console.log('locations null ????? ' + JSON.stringify(locations))}
      </MapView>
      <ZoomInBottom
        onPress={() =>
          _zoomIn(
            latitude,
            longitude,
            latDelta,
            lonDelta,
            latitudeMY,
            longitudeMY,
          )
        }>
        <ZoomIcon size={30} name={'plus'} color={`${GREY_COLOR3}`} />
      </ZoomInBottom>
      <ZoomOutBottom
        onPress={() =>
          _zoomOut(
            latitude,
            longitude,
            latDelta,
            lonDelta,
            latitudeMY,
            longitudeMY,
          )
        }>
        <ZoomIcon size={30} name={'minus'} color={`${GREY_COLOR3}`} />
      </ZoomOutBottom>
      <MyLocationBottom onPress={() => _getLocation(latitudeMY, longitudeMY)}>
        <MyLocationIcon
          size={30}
          name={'my-location'}
          color={`${GREY_COLOR3}`}
        />
      </MyLocationBottom>
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
  ) : mainState === 'battle' ? (
    <MapContainer>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={map => (this.map = map)}
        // showsMyLocationButton
        rotateEnabled={false}
        onRegionChange={region => onRegionChange(region)}
        showsUserLocation
        style={{
          width: Layout.width,
          height: Layout.height,
          position: 'absolute',
        }}
        initialRegion={{
          latitude: latitudeMY,
          longitude: longitudeMY,
          latitudeDelta: latDelta,
          longitudeDelta: lonDelta,
        }}>
        {locations
          ? locations.locations
              .filter(list => list.key !== null)
              .map((list, index) => (
                <Marker
                  key={list.key}
                  ref={marker => (locations.mark[index] = marker)}
                  // ref={marker => (this.marker = marker)}
                  onPress={() => onMarkerPressed(list)}
                  onCalloutPress={() =>
                    onSavePlace(list.title + '\n' + list.address, navigation)
                  }
                  coordinate={list.location}
                  title={list.title}
                  description={list.address}
                  show>
                  {Platform.OS === 'ios' ? (
                    <Callout
                      tooltip={true}
                      style={styles.callout}
                      onPress={() =>
                        onSavePlace(
                          list.title + '\n' + list.address,
                          navigation,
                        )
                      }>
                      <Text style={styles.title}>{list.title}</Text>
                      <Text style={styles.description}>{list.address}</Text>
                    </Callout>
                  ) : null}
                </Marker>
              ))
          : console.log('locations null ????? ' + JSON.stringify(locations))}
      </MapView>
      <ZoomIn
        onPress={() =>
          _zoomIn(
            latitude,
            longitude,
            latDelta,
            lonDelta,
            latitudeMY,
            longitudeMY,
          )
        }>
        <ZoomIcon size={30} name={'plus'} color={`${GREY_COLOR3}`} />
      </ZoomIn>
      <ZoomOut
        onPress={() =>
          _zoomOut(
            latitude,
            longitude,
            latDelta,
            lonDelta,
            latitudeMY,
            longitudeMY,
          )
        }>
        <ZoomIcon size={30} name={'minus'} color={`${GREY_COLOR3}`} />
      </ZoomOut>
      <MyLocation onPress={() => _getLocation(latitudeMY, longitudeMY)}>
        <MyLocationIcon
          size={30}
          name={'my-location'}
          color={`${GREY_COLOR3}`}
        />
      </MyLocation>
      <NoticeContainer>
        <NoticeText>
          배틀장소의 주소를 클릭해{'\n'}상대방에게 장소를 알려주세요!
        </NoticeText>
      </NoticeContainer>
      <MView>
        {JSON.stringify(listChanged[INDEX].matched_content_images) === '[]' ? (
          <MainSlide
            map={true}
            overview={listChanged[INDEX].description}
            avg={listChanged[INDEX].like_count}
            title={listChanged[INDEX].title}
            id={listChanged[INDEX].id}
            backgroundPoster={'no'}
            poster={'no'}
            detail={listChanged[INDEX].detail}
          />
        ) : (
          <MainSlide
            map={true}
            overview={listChanged[INDEX].description}
            avg={listChanged[INDEX].like_count}
            title={listChanged[INDEX].title}
            id={listChanged[INDEX].id}
            backgroundPoster={
              listChanged[INDEX].matched_content_images[0].full_filename
            }
            poster={listChanged[INDEX].matched_content_images}
            detail={listChanged[INDEX].detail}
          />
        )}
      </MView>
    </MapContainer>
  ) : (
    <MapContainer>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={map => (this.map = map)}
        // showsMyLocationButton
        rotateEnabled={false}
        onRegionChange={region => onRegionChange(region)}
        showsUserLocation
        style={{
          width: Layout.width,
          height: Layout.height,
          position: 'absolute',
        }}
        initialRegion={{
          latitude: latitudeMY,
          longitude: longitudeMY,
          latitudeDelta: latDelta,
          longitudeDelta: lonDelta,
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
      <ZoomIn
        onPress={() =>
          _zoomIn(
            latitude,
            longitude,
            latDelta,
            lonDelta,
            latitudeMY,
            longitudeMY,
          )
        }>
        <ZoomIcon size={30} name={'plus'} color={`${GREY_COLOR3}`} />
      </ZoomIn>
      <ZoomOut
        onPress={() =>
          _zoomOut(
            latitude,
            longitude,
            latDelta,
            lonDelta,
            latitudeMY,
            longitudeMY,
          )
        }>
        <ZoomIcon size={30} name={'minus'} color={`${GREY_COLOR3}`} />
      </ZoomOut>
      <MyLocation onPress={() => _getLocation(latitudeMY, longitudeMY)}>
        <MyLocationIcon
          size={30}
          name={'my-location'}
          color={`${GREY_COLOR3}`}
        />
      </MyLocation>
      <MView>
        {JSON.stringify(listChanged[INDEX].matched_content_images) === '[]' ? (
          <MainSlide
            map={true}
            overview={listChanged[INDEX].description}
            avg={listChanged[INDEX].like_count}
            title={listChanged[INDEX].title}
            id={listChanged[INDEX].id}
            backgroundPoster={'no'}
            poster={'no'}
            detail={listChanged[INDEX].detail}
          />
        ) : (
          <MainSlide
            map={true}
            overview={listChanged[INDEX].description}
            avg={listChanged[INDEX].like_count}
            title={listChanged[INDEX].title}
            id={listChanged[INDEX].id}
            backgroundPoster={
              listChanged[INDEX].matched_content_images[0].full_filename
            }
            poster={listChanged[INDEX].matched_content_images}
            detail={listChanged[INDEX].detail}
          />
        )}
      </MView>
    </MapContainer>
  );

export default withNavigation(MapPresenter);

{
  /* <SwiperFlatList
          ref={swiper => {
            this.swiper = swiper;
          }}
          index={0}
          renderAll={true}
          // onChangeIndex={index => onSwiperItemChange(index.index, locations)}
          onChangeIndex={index => onSwiperItemChangeFlat(index, locations)}
          style={{
            height: (Layout.width / 5) * 3,
            position: 'absolute',
            bottom: 20,
          }}
          data={listChanged}
          renderItem={list =>
            JSON.stringify(list.item.matched_content_images) === '[]' ? (
              <MainSlide
                map={true}
                overview={list.item.description}
                avg={list.item.like_count}
                title={list.item.title}
                id={list.item.id}
                backgroundPoster={'no'}
                poster={'no'}
                detail={list.item.detail}
              />
            ) : (
              <MainSlide
                map={true}
                overview={list.item.description}
                avg={list.item.like_count}
                title={list.item.title}
                id={list.item.id}
                backgroundPoster={
                  list.item.matched_content_images[0].full_filename
                }
                poster={list.item.matched_content_images}
                detail={list.item.detail}
              />
            )
          }
        /> */
}
