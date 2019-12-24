import React from "react";
import { View, Text, Platform } from "react-native";
import CoursePresenter from "./CoursePresenter";
import { tv, movie } from "../../../api/Api";

export default class extends React.Component {
  state = {
    loading: true,
    latitude: null,
    longitude: null,
    listChanged: null,
    error: null
  };

  // 시작시 불러옴
  async componentDidMount() {
    // const { status } = await Permissions.getAsync(Permissions.LOCATION);
    // if (status != "granted") {
    //   const response = await Permissions.askAsync(Permissions.LOCATION);
    // }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        this.setState({ latitude, longitude }),
      // () => console.log("State : ", this.state),
      error => console.log("Error : ", error)
    );
    let listChanged, error;
    try {
      ({
        data: { results: listChanged }
      } = await movie.getSearchMovie("king"));
    } catch (error) {
      console.log(error);
      error = "Cnat't get Course";
    } finally {
      this.setState({
        loading: false,
        listChanged,
        error
      });
    }
  }
  render() {
    const { loading, latitude, longitude, listChanged } = this.state;
    // 위치정보 받기 전
    if (latitude) {
      return (
        <CoursePresenter
          loading={loading}
          listChanged={listChanged}
          latitude={latitude}
          longitude={longitude}
        />
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>위치정보를 불러오는중입니다....</Text>
      </View>
    );
  }
}
