import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {BG_COLOR, TINT_COLOR} from '../../../constants/Colors';
import styled from 'styled-components';
import Layout from '../../../constants/Layout';

const Container = styled.View`
  flex: 1;
  border-radius: 20;
  background-color: ${TINT_COLOR};
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  color: ${BG_COLOR};
  margin: 40px;
  font-size: 15px;
  font-weight: 500;
`;

const Image = styled.Image``;

const SearchNo = giveText => {};

export default class extends React.Component {
  state = {
    searchText: '',
  };

  // text 검색한 값 받아온다
  handleGetSearchText = text => {
    this.setState({
      searchText: text,
    });
    this.state.searchText = text;
    console.log(text);
  };

  render() {
    return (
      <Container>
        <Text>{this.props.text}</Text>
        <Image
          width={Layout.width / 2}
          height={Layout.height / 2}
          source={require(`../../../assets/drawable-xxhdpi/icon_loser_or.png`)}></Image>
      </Container>
    );
  }
}
