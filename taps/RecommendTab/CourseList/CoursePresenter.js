import React from 'react';
import {withNavigation} from 'react-navigation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {BG_COLOR, TINT_COLOR, GREY_COLOR3} from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import {Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import SearchNo from '../../../screens/Main/Search/SearchNo';

const MapContainer = styled.View`
  margin-top: 4px;
  height: ${Layout.height / 3};
  background-color: ${TINT_COLOR};
  border-top-left-radius: 15;
  border-top-right-radius: 15;
`;

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.ScrollView`
  background-color: ${TINT_COLOR};
  padding-top: 10;
  padding-bottom: 20;
  padding-left: 20;
  flex: 1;
`;

// setMarkerRef = ref => {
//   this.marker = ref;
// };

//FIXME: 더미 데이터 수정해야함
const onMarkerPressed = location => {
  console.log('locations ::: ' + JSON.stringify(location));
  if (this.map) {
    this.map.animateToRegion({
      latitude: location.location.latitude,
      longitude: location.location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
    // location.showCallout();
    // location[0].showCallout();
  } else {
    console.log('map: null');
  }
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

// show DATA
const CoursePresenter = ({
  loading,
  latitude,
  longitude,
  listChanged,
  markerOn,
  locations,
  clickID,
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
          }}
          onRegionChangeComplete={() => this.marker.showCallout()}>
          {/* {locations.map(list => (
            <Marker
              key={list.id}
              coordinate={list.location}
              title={list.title}
              description={list.address}
            />
          ))} */}
          {locations
            .filter(list => list.id === clickID)
            .map(list => (
              <Marker
                ref={marker => (this.marker = marker)}
                key={list.id}
                coordinate={list.location}
                title={list.title}
                description={list.address}
              />
            ))}
          {locations
            .filter(list => list.id === clickID)
            .map(list => onMarkerPressed(list))}
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
                    .filter(list => list.id !== null)
                    .map(list => (
                      <SubSlide
                        tag={'recommend'}
                        horizontal={false}
                        key={list.id}
                        id={list.id}
                        backgroundPoster={
                          list.matched_content_images[0].full_filename
                        }
                        title={list.title}
                        overview={list.description}
                        detail={list.detail}
                        markerOn={markerOn}
                        avg={list.like_count}
                      />
                    ))}
                </Section>
              ) : (
                <SearchNo text={'등록된 추천경로가 없습니다.'} />
              )
            ) : (
              console.log('null')
            )}
          </>
        )}
      </Container>
    </View>
  );

export default withNavigation(CoursePresenter);
