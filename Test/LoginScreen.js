import React from 'react';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  font-size: 30px;
`;

const Input = styled.TextInput``;

const Btn = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  background-color: royalblue;
`;

export default class LoginScreen extends React.Component {
  state = {
    name: '',
  };
  continue = () => {
    this.props.navigation.navigate('Chat', this.state.name);
  };

  render() {
    return (
      <Container>
        <Text>USER NAME</Text>
        <Input></Input>
        <Btn onPress={this.continue} />
      </Container>
    );
  }
}
