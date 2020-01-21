import React from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  BG_COLOR,
  GREY_COLOR,
  GREY_COLOR2,
  RED_COLOR,
  TINT_COLOR,
} from '../../constants/Colors';
import Layout from '../../constants/Layout';
import makePhotoUrl from '../../api/PhotoUri';
import Swiper from 'react-native-swiper';
import MainSlide from '../../components/MainSlide';
import Icon from 'react-native-vector-icons/Ionicons';
import IconLike from 'react-native-vector-icons/AntDesign';
import GetPhoto from '../../api/GetPhoto';

// keybord
// const KeyboardAvoidingView = styled.KeyboardAvoidingView`
//   flex: 1;
// `;

var scrollViewRef = React.createRef();
const _scrollToBottom = () => {
  setTimeout(() => {
    scrollViewRef.current.scrollToEnd({animated: true});
  }, 500);
};
// 전체
const Container = styled.ScrollView`
  background-color: ${TINT_COLOR};
  flex: 1;
`;

const VIEW_HEIGHT = Layout.height / 4;
const View = styled.View`
  height: ${VIEW_HEIGHT};
  position: absolute;
`;

// 이미지
const ImageContainer = styled.View`
  background-color: #fee6d0;
  position: absolute;
`;

const Image = styled.Image`
  width: ${Layout.width};
  height: ${Layout.height / 3};
  background-color: #fee6d0;
`;

// 내용
const ContextContainer = styled.View`
  flex: 1;
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  /* padding-right: 10px; */
  padding-bottom: 20px;
  /* margin-top: ${Layout.height / 3 - 20}; */
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  padding: 20px;
  border-color: ${GREY_COLOR};
  border-bottom-width: 1;
`;

const HeaderText = styled.Text`
  flex: 1;
  color: black;
  font-weight: 600;
  font-size: 20px;
  margin: 5px;
  justify-content: space-between;
`;

const IconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  margin-right: 5px;
  margin-top: 50px;
`;
const TouchableOpacity = styled.TouchableOpacity`
  margin-right: 8px;
`;
const ShareIcon = styled.Image`
  width: 24;
  height: 25;
  /* margin-right: 15px; */
`;
const WishIcon = styled.Image`
  width: 25;
  height: 21.5;
  margin-right: 15px;
`;
const LikeIcon = styled.Image`
  width: 24;
  height: 25;
  margin-right: 15px;
`;
const Profile = styled.Image`
  width: 30;
  height: 30;
  margin-right: 10px;
  margin-left: 20px;
  align-self: center;
`;

const LikeCount = styled.Text`
  color: ${BG_COLOR};
  font-size: 16px;
  font-weight: 600;
`;

const TitleText = styled.Text`
  color: black;
  font-weight: 400;
  font-size: 16px;
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 15px;
`;

const ContextText = styled.Text`
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 15px;
  color: ${GREY_COLOR2};
  font-size: 14px;
`;

// 댓글
const CommentContainer = styled.ScrollView`
  margin-top: 15px;
  border-color: ${GREY_COLOR};
  border-top-width: 1;
`;

// 입력창
const InputContainer = styled.View`
  width: ${Layout.width};
  padding: 8px;
  border-top-width: 1;
  border-color: ${GREY_COLOR2};
  bottom: 0;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const Input = styled.TextInput`
  width: 80%;
  max-height: ${Layout.height / 7};
  margin-right: 20px;
  color: black;
  font-size: 14px;
  padding-left: 10px;
  padding-right: 40px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-color: ${GREY_COLOR2};
  border-width: 1;
  border-radius: 15;
  align-self: center;
  justify-content: flex-end;
  background-color: white;
`;

const SendContainer = styled.TouchableOpacity`
  position: absolute;
  justify-content: flex-end;
  right: 0;
  padding-right: 15px;
  margin-right: 20px;
`;

const SendText = styled.Text`
  color: ${BG_COLOR};
  font-size: 14px;
  font-weight: 600;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const DetailPresenter = ({
  id,
  backgroundPoster,
  poster,
  title,
  avg,
  overview,
  msg,
  handleMsgUpdate,
  insertCommentList,
  like,
  likeUp,
  likeDown,
  wish,
  wishListIn,
  wishListOut,
  detail,
}) => (
  <>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled>
      <Container>
        {backgroundPoster.includes('/contents/') ? (
          <Swiper
            marginBottom={20}
            showsPagination={true}
            autoplay={false}
            autoplayTimeout={3}
            onIndexChanged={index => console.log('change: ' + index)}
            style={{
              height: Layout.height / 3,
            }}>
            {poster ? (
              poster.map(image => (
                <View>
                  <Image source={{uri: GetPhoto(image.full_filename)}} />
                </View>
              ))
            ) : (
              <ImageContainer>
                <Image source={{uri: GetPhoto(backgroundPoster)}} />
              </ImageContainer>
            )}
          </Swiper>
        ) : (
          <ImageContainer>
            <Image source={{uri: makePhotoUrl(backgroundPoster)}} />
          </ImageContainer>
        )}
        {/* <ImageContainer>
        {backgroundPoster.includes('/contents/') ? (
          <Image source={{uri: GetPhoto(backgroundPoster)}} />
        ) : (
          <Image source={{uri: makePhotoUrl(backgroundPoster)}} />
        )}
      </ImageContainer> */}
        <ContextContainer>
          <HeaderContainer>
            <HeaderText>{title}</HeaderText>
            <IconContainer>
              <TouchableOpacity>
                <ShareIcon
                  source={require(`../../assets/drawable-xxhdpi/icon_share_copy.png`)}
                />
              </TouchableOpacity>
              {wish ? (
                <TouchableOpacity onPress={() => wishListOut()}>
                  <Icon
                    size={Platform.OS === 'ios' ? 30 : 30}
                    name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'}
                    color={`${BG_COLOR}`}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => wishListIn()}>
                  <Icon
                    size={Platform.OS === 'ios' ? 30 : 30}
                    name={
                      Platform.OS === 'ios'
                        ? 'ios-heart-empty'
                        : 'md-heart-empty'
                    }
                    color={`${BG_COLOR}`}
                  />
                </TouchableOpacity>
              )}
              {like ? (
                <TouchableOpacity onPress={() => likeDown()}>
                  <IconLike
                    size={Platform.OS === 'ios' ? 25 : 25}
                    name={'like1'}
                    color={`${BG_COLOR}`}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => likeUp()}>
                  <IconLike
                    size={Platform.OS === 'ios' ? 25 : 25}
                    name={'like2'}
                    color={`${BG_COLOR}`}
                  />
                </TouchableOpacity>
              )}
              <LikeCount>{avg}</LikeCount>
            </IconContainer>
          </HeaderContainer>
          <TitleText>매장소개</TitleText>
          <ContextText>{overview}</ContextText>
          <TitleText>영업시간</TitleText>
          <ContextText>주소: {detail.address_name}</ContextText>
          <ContextText>시간: {detail.operating_hours}</ContextText>
          <ContextText>휴무일: {detail.holidays}</ContextText>
          <ContextText>이벤트: {detail.events}</ContextText>
          <ContextText>전화번호: {detail.tel_number}</ContextText>
          <CommentContainer ref={scrollViewRef}>
            <ContextText>댓글({avg})</ContextText>
          </CommentContainer>
        </ContextContainer>
      </Container>

      <InputContainer>
        <Profile
          source={require(`../../assets/drawable-xxhdpi/icon_profile.png`)}
        />
        <Input
          onChangeText={handleMsgUpdate}
          value={msg}
          onFocus={_scrollToBottom()}
          returnKeyType={'next'}
          placeholder="댓글 달기..."
          placeholderTextColor={GREY_COLOR2}
          // onSubmitEditing={onSubmitEditing}
          autoCorrect={false}
          multiline={true}
        />
        <SendContainer onPress={() => insertCommentList(msg)}>
          <SendText>게시</SendText>
        </SendContainer>
      </InputContainer>
    </KeyboardAvoidingView>
  </>
);

DetailPresenter.prototypes = {
  id: PropTypes.number.isRequired,
  backgroundPoster: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  avg: PropTypes.number,
  overview: PropTypes.string,
};

export default DetailPresenter;
