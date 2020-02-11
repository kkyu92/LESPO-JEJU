import React from 'react';
import styled from 'styled-components';
import Swiperable from 'react-native-gesture-handler/Swipeable';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import {
  GREY_COLOR,
  GREY_COLOR2,
  TINT_COLOR,
  RED_COLOR,
} from '../constants/Colors';
import Layout from '../constants/Layout';
import moment from 'moment';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;
  padding-top: 10px;
  background-color: ${TINT_COLOR};
`;
const ProfileContainer = styled.View`
  width: 20%;
  align-items: center;
  justify-content: center;
`;
const TextContainer = styled.View`
  width: 65%;
  align-items: flex-start;
  justify-content: center;
`;
const DateContainer = styled.View`
  width: 15%;
  align-items: flex-end;
  justify-content: center;
`;

const Profile = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
const NameText = styled.Text`
  color: black;
  font-size: 15px;
  font-weight: 800;
`;
const CommentText = styled.Text`
  color: ${GREY_COLOR2};
  font-size: 12px;
  font-weight: 600;
`;
const DateText = styled.Text`
  color: ${GREY_COLOR};
  font-size: 10px;
  font-weight: 600;
  align-self: flex-end;
`;

const styles = StyleSheet.create({
  container: {
    backgroundColor: TINT_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  text: {
    color: TINT_COLOR,
    fontSize: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: TINT_COLOR,
    marginLeft: 10,
  },
  rightAction: {
    backgroundColor: RED_COLOR,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  actionText: {
    color: TINT_COLOR,
    fontWeight: '600',
    padding: 20,
    fontSize: 15,
  },
});
let row = [];
let prevOpenedRow;
const RightAction = ({progress, dragX, onPress}) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 0],
    extrapolate: 'clamp',
  });
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.rightAction}>
        <Animated.Text style={[styles.actionText, {transform: [{scale}]}]}>
          DELETE
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};
const closeRow = index => {
  console.log(index);
  if (prevOpenedRow && prevOpenedRow !== row[index]) {
    prevOpenedRow.close();
  }
  prevOpenedRow = row[index];
};

// 체팅 리스트 아이템
const CommentSlide = ({
  index,
  commentId,
  commentText,
  userId,
  userName,
  time,
  onRightPress,
}) => (
  <Swiperable
    ref={ref => (row[index] = ref)}
    onSwipeableOpen={() => closeRow(index)}
    renderRightActions={(progress, dragX) => (
      <RightAction
        progress={progress}
        dragX={dragX}
        onPress={() => onRightPress(commentId)}
      />
    )}>
    <Container>
      <ProfileContainer>
        <Profile
          source={require(`../assets/drawable-xxhdpi/icon_profile.png`)}
        />
      </ProfileContainer>
      <TextContainer>
        <NameText>{userName}</NameText>
        <CommentText>{commentText}</CommentText>
      </TextContainer>
      <DateContainer>
        <DateText>{moment(time).format('MM월 D일 h:mm a')}</DateText>
      </DateContainer>
    </Container>
  </Swiperable>
);
// console.log(commentId, commentText, userId, userName, time);
export const Separator = () => <View style={styles.separator} />;
export default CommentSlide;
