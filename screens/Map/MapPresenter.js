import React from 'react';
import {withNavigation} from 'react-navigation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import styled from 'styled-components';
import Loader from '../../components/Loader';
import {TINT_COLOR, GREY_COLOR3} from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainSlider from '../../components/MainSlider';

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
  top: 0;
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

const loactions = {
  markers: [
    {
      key: 1,
      name: 'Rixos The Palm Dubai',
      text: 'Text tttt::: Rixos The Palm Dubai',
      location: {latitude: 25.1212, longitude: 55.1535},
    },
    {
      key: 2,
      name: 'Shangri-La Hotel',
      text: 'Text tttt::: Shangri-La Hotel',
      location: {latitude: 25.2084, longitude: 55.2719},
    },
    {
      key: 3,
      name: 'Grand Hyatt',
      text: 'Text tttt::: Grand Hyatt',
      location: {latitude: 25.2285, longitude: 55.3273},
    },
  ],
};

const _getLocation = async (latitude, longitude) => {
  this.map.animateToRegion(
    {latitude, longitude, latitudeDelta: 0.09, longitudeDelta: 0.035},
    1000,
  );
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
        {loactions.markers.map(list => (
          <Marker
            key={list.key}
            coordinate={list.location}
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
        <MainSlider map={true} movies={listChanged} />
      </MView>
    </MapContainer>
  );

export default withNavigation(MapPresenter);
