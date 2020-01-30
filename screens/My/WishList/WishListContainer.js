import React from 'react';
import WishListPresenter from './WishListPresenter';
import {tv, movie, LESPO_API} from '../../../api/Api';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

export default class extends React.Component {
  static navigationOptions = () => {
    return {
      title: '위시리스트',
    };
  };

  state = {
    loading: true,
    listChanged: null,
    locations: null,
    error: null,
  };

  async componentDidMount() {
    this.onListChanging();
    // 화면 돌아왔을 때 reload !
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        console.log('willFocus ::: reload');
        this.onListChanging();
      }),
    ];
  }

  onListChanging = async () => {
    this.setState({
      loading: true,
    });
    let TOKEN = await AsyncStorage.getItem('@API_TOKEN');
    const config = {
      headers: {
        Authorization: TOKEN,
      },
    };
    let allList = [];
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
      } = await LESPO_API.getReco(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      ({
        data: {data: listChanged},
      } = await LESPO_API.getFoodList(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      ({
        data: {data: listChanged},
      } = await LESPO_API.getViewList(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      ({
        data: {data: listChanged},
      } = await LESPO_API.getPlayList(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      ({
        data: {data: listChanged},
      } = await LESPO_API.getSportsList(config));
      listChanged
        .filter(list => list.is_wishlist_added_count === 1)
        .forEach(list => {
          allList.push(list);
        });

      // latest sorting
      allList = allList.sort(function(a, b) {
        return (
          new Date(moment(b.wishlist_id.updated_at).format()) -
          new Date(moment(a.wishlist_id.updated_at).format())
        );
      });

      // markers push all
      allList.forEach(child => {
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
      // console.log('wish List : ' + JSON.stringify(allList));
      // console.log('wish List Locatoins : ' + JSON.stringify(locations));
    } catch (error) {
      console.log(error);
      error = "Cnat't get WishList";
    } finally {
      this.setState({
        loading: false,
        listChanged: allList,
        locations: locations,
        error,
      });
    }
  };

  // 나갔을때
  componentWillUnmount() {
    console.log('componentWillUnmount ::: ');
    this.subs.forEach(sub => sub.remove());
  }

  render() {
    const {loading, listChanged, locations} = this.state;
    return (
      <WishListPresenter
        loading={loading}
        listChanged={listChanged}
        locations={locations}
      />
    );
  }
}
