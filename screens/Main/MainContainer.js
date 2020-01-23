import React from 'react';
import MainPresenter from './MainPresenter';
import {movie, LESPO_API} from '../../api/Api';
import styled from 'styled-components';

const RightButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
`;

const WishListBtn = styled.TouchableOpacity`
  margin-right: 15px;
`;

const WishList = styled.Image`
  width: 29px;
  height: 25.4px;
`;
const Map = styled.Image`
  width: 23.6px;
  height: 29px;
`;

const MapBtn = styled.TouchableOpacity``;

// set DATA = Container
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mainList: [],
      foodList: [],
      playList: [],
      viewList: [],
      error: null,
    };
    console.log('constructor');
    // this.getData();
  }

  getData = async () => {
    let {mainList, foodList} = this.state;
    let error;
    try {
      ({
        data: {data: mainList},
      } = await LESPO_API.getMainList())(
        ({
          data: {data: foodList},
        } = await LESPO_API.getMainFoodList()),
      );
    } catch (error) {
      console.log(error);
      error = "Cant't get MainList.";
    } finally {
      this.setState({
        mainList: mainList,
        foodList: foodList,
      });
      // console.log('foodList: ' + JSON.stringify(foodList));
    }
  };
  async componentWillMount() {
    this.getData();
  }

  async componentDidMount() {
    // let : 변할 수 있는 변수
    let {playList, viewList} = this.state;
    let error;
    try {
      ({
        data: {data: playList},
      } = await LESPO_API.getMainPlayList()),
        ({
          data: {data: viewList},
        } = await LESPO_API.getMainViewList());
    } catch (error) {
      console.log(error);
      error = "Cant't get MainList.";
    } finally {
      this.setState({
        loading: false,
        playList: playList,
        viewList: viewList,
      });
      // console.log('viewList: ' + JSON.stringify(viewList));
    }
  }

  render() {
    const {loading, mainList, foodList, playList, viewList} = this.state;
    // console.log(nowPlaying);
    return (
      <MainPresenter
        loading={loading}
        mainList={mainList}
        foodList={foodList}
        playList={playList}
        viewList={viewList}
      />
    );
  }
}
