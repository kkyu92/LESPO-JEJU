import React from 'react';
import {withNavigation} from 'react-navigation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {
  BG_COLOR,
  TINT_COLOR,
  BLACK_COLOR,
  GREY_COLOR3,
} from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import {Platform} from 'react-native';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import SearchNo from '../../../screens/Main/Search/SearchNo';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MapContainer = styled.View`
  margin-top: 4px;
  height: ${Layout.height / 3};
  background-color: ${TINT_COLOR};
  border-top-left-radius: 15;
  border-top-right-radius: 15;
`;

//FIXME: 더미 데이터 수정해야함
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

const MyLocation = styled.TouchableOpacity`
  position: absolute;
  background-color: ${TINT_COLOR};
  width: 50px;
  height: 50px;
  right: 0;
  bottom: 0;
  margin: 20px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  /* padding:10px; */
`;

const _getLocation = async (latitude, longitude) => {
  this.map.animateToRegion(
    {latitude, longitude, latitudeDelta: 0.09, longitudeDelta: 0.035},
    1000,
  );
};

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.ScrollView`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: white;
  padding-top: 10;
  padding-bottom: 20;
  padding-left: 20;
  flex: 1;
`;

// show DATA
const FoodListPresenter = ({
  loading,
  listChanged,
  latitude,
  longitude,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <MapContainer>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={map => (this.map = map)}
          // showsMyLocationButton
          showsUserLocation
          style={{flex: 1}}
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
      </MapContainer>
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <>
            {listChanged ? (
              listChanged.length > 0 ? (
                <Section horizontal={false} title="">
                  {listChanged
                    .filter(list => list.backdrop_path !== null)
                    .map(list => (
                      <SubSlide
                        tag={'recommend'}
                        horizontal={false}
                        key={list.id}
                        id={list.id}
                        backgroundPoster={list.backdrop_path}
                        title={list.title}
                        avg={list.vote_average}
                        overview={list.overview}
                      />
                    ))}
                </Section>
              ) : (
                <SearchNo handleGetSearchText={searchTerm} />
              )
            ) : (
              console.log('null')
            )}
          </>
        )}
      </Container>
    </View>
  );

export default withNavigation(FoodListPresenter);
