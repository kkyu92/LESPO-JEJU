import React from 'react';
import MainPresenter from './MainPresenter';
import {movie} from '../../api/Api';
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
  // static navigationOptions = ({navigation} = {
  //   header: 'null',
  //   headerBackTitle: 'null',
  //   //TODO: 헤더 좌우로 아이콘 만들기 가능
  //   headerRight: (
  //     <RightButtonContainer>
  //       <WishListBtn onPress={() => navigation.navigate('MyWishList')}>
  //         <WishList
  //           source={require(`../../assets/drawable-xxxhdpi/icon_wish_wh.png`)}
  //         />
  //       </WishListBtn>

  //       <MapBtn onPress={() => alert('지도 페이지 만들어야 함')}>
  //         <Map
  //           source={require(`../../assets/drawable-xxxhdpi/icon_map_wh.png`)}
  //         />
  //       </MapBtn>
  //     </RightButtonContainer>
  //   ),
  // });
  // init 초기상태 값 설정
  state = {
    loading: true,
    upComing: null,
    popular: null,
    nowPlaying: null,
    error: null,
  };

  async componentDidMount() {
    // let : 변할 수 있는 변수
    let upComing, popular, nowPlaying, error;
    try {
      ({
        data: {results: upComing},
      } = await movie.getUpComing())(
        ({
          data: {results: popular},
        } = await movie.getPopular()),
      )(
        ({
          data: {results: nowPlaying},
        } = await movie.getNowPlaying()),
      );
    } catch (error) {
      console.log(error);
      error = "Cant't get Movies.";
    } finally {
      this.setState({
        loading: false,
        error,
        upComing,
        popular,
        nowPlaying,
      });
    }
  }

  render() {
    const {loading, upComing, popular, nowPlaying} = this.state;
    // console.log(nowPlaying);
    return (
      <MainPresenter
        loading={loading}
        upComing={upComing}
        popular={popular}
        nowPlaying={nowPlaying}
      />
    );
  }
}
