import React from 'react';
import {Platform, KeyboardAvoidingView, SafeAreaView} from 'react-native';
import {GiftChat} from 'react-native-gifted-chat';
import Fire from '../../../components/Fire';

export default class Chat extends React.Component {
  state = {
    messages: [],
  };

  get user() {
    return {
      _id: Fire.uid,
      // name: this.props.navigation.state.params.name,
      name: 'kkyu',
    };
  }

  componentDidMount() {
    Fire.get(message =>
      this.setState(previous => ({
        messages: GiftChat.append(previous.messages, message),
      })),
    );
  }

  componentWillUnmount() {
    Fire.off();
  }

  render() {
    const chatList = (
      <GiftChat
        messages={this.state.messages}
        onSend={Fire.send}
        user={this.user}
      />
    );
    if (Platform.OS === 'android') {
      return (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={'padding'}
          keyboardVerticalOffset={30}
          enabled>
          {chatList}
        </KeyboardAvoidingView>
      );
    }
    return <SafeAreaView style={{flex: 1}}>{chatList}</SafeAreaView>;
  }
}
