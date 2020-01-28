import React from 'react';
import MainPresenter from './MainPresenter';
import {LESPO_API} from '../../api/Api';

// set DATA = Container
export default class extends React.Component {
  _isMounted = false;
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
  }

  async componentDidMount() {
    this._isMounted = true;
    console.log('componentDidMount');
    try {
      await LESPO_API.getMainList()
        .then(response => {
          this.setState({
            mainList: response.data.data,
          });
        })
        .catch(error => {
          console.log('getMainList fail: ' + error);
        });
      await LESPO_API.getMainFoodList()
        .then(response => {
          this.setState({
            foodList: response.data.data,
          });
        })
        .catch(error => {
          console.log('getFoodList fail: ' + error);
        });
      await LESPO_API.getMainPlayList()
        .then(response => {
          this.setState({
            playList: response.data.data,
          });
        })
        .catch(error => {
          console.log('getPlayList fail: ' + error);
        });
      await LESPO_API.getMainViewList()
        .then(response => {
          this.setState({
            viewList: response.data.data,
          });
          if (this._isMounted) {
            console.log('on');
            this.setState({
              loading: false,
            });
          } else {
            console.log('off');
          }
        })
        .catch(error => {
          console.log('getViewList fail: ' + error);
        });
    } catch (error) {
      console.log("Cant't get MainList. : " + error);
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this._isMounted = false;
  }

  render() {
    const {loading, mainList, foodList, playList, viewList} = this.state;
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
