import React from 'react';
import {Platform, View, Text} from 'react-native';
import SeaPresenter from './SeaPresenter';
import {tv, movie, LESPO_API} from '../../../api/Api';

export default class extends React.Component {
  state = {
    loading: true,
    listChanged: null,
    locations: null,
    error: null,
  };

  // 시작시 불러옴
  async componentDidMount() {
    let listChanged = [];
    let locations = {
      mark: [],
      locations: [],
    };
    let count = 0;
    let error;
    try {
      ({
        data: {data: listChanged},
      } = await LESPO_API.getViewSea());
      // console.log('View Sea List : ' + JSON.stringify(listChanged));
      listChanged.forEach(child => {
        let num = child.id;
        child.detail.marker_address.forEach(child => {
          locations.locations.push({
            id: num,
            key: count,
            location: {
              latitude: window.parseFloat(child.lat),
              longitude: window.parseFloat(child.lng),
            },
            title: child.title,
            address: child.address,
          });
          count++;
        });
      });
      // console.log('View Sea Locatoins : ' + JSON.stringify(locations));
    } catch (error) {
      console.log(error);
      error = "Cnat't get ViewSeaList";
    } finally {
      this.setState({
        loading: false,
        listChanged: listChanged,
        locations: locations,
        error,
      });
    }
  }
  render() {
    const {loading, listChanged, locations} = this.state;
    // 위치정보 받기 전
    if (listChanged) {
      return (
        <SeaPresenter
          loading={loading}
          listChanged={listChanged}
          locations={locations}
        />
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>정보를 불러오는중입니다....</Text>
        </View>
      );
    }
  }
}
