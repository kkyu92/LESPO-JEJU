import React from 'react';
import {KeyboardAvoidingView, StyleSheet, Platform} from 'react-native';
import styled from 'styled-components';
import {
  BG_COLOR,
  GREY_COLOR,
  GREY_COLOR2,
  TINT_COLOR,
  GREY_COLOR3,
} from '../../constants/Colors';
import Layout from '../../constants/Layout';
import makePhotoUrl from '../../api/PhotoUri';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import IconLike from 'react-native-vector-icons/AntDesign';
import GetPhoto from '../../api/GetPhoto';
import Loader from '../../components/Loader';
import CommentSlide from '../../components/CommentSlide';

var scrollViewRef = React.createRef();
const SwiperView = styled.View``;
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
const NullImageContainer = styled.View`
  background-color: ${GREY_COLOR};
  width: 100%;
  height: ${Layout.height / 3};
  align-items: center;
  justify-content: center;
`;

const NullImage = styled.Image`
  width: 100px;
  height: 100px;
`;

const Image = styled.Image`
  width: ${Layout.width};
  height: ${Layout.height / 3};
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
  width: 40px;
  height: 40px;
  border-radius: 20px;
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
  margin-bottom: 15px;
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
  loading,
  id,
  backgroundPoster,
  poster,
  title,
  avg,
  overview,
  msg,
  handleMsgUpdate,
  insertCommentList,
  kakaoLink,
  likeUp,
  likeDown,
  wishListIn,
  wishListOut,
  detail,
  isLike,
  isWish,
  comments,
  deleteComment,
  reco,
}) =>
  loading ? (
    <Loader />
  ) : reco ? (
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
            <NullImageContainer>
              <NullImage
                source={require(`../../assets/drawable-xxhdpi/img_noimage.png`)}
              />
            </NullImageContainer>
          )}
        </Swiper>
      ) : (
        <NullImageContainer>
          <NullImage
            source={require(`../../assets/drawable-xxhdpi/img_noimage.png`)}
          />
        </NullImageContainer>
      )}
      <ContextContainer>
        <HeaderContainer>
          <HeaderText>{title}</HeaderText>
        </HeaderContainer>
        <TitleText>매장소개</TitleText>
        <ContextText>{overview}</ContextText>
        <TitleText>영업시간</TitleText>
        <ContextText>주소: {detail.address_name}</ContextText>
        <ContextText>시간: {detail.operating_hours}</ContextText>
        <ContextText>휴무일: {detail.holidays}</ContextText>
        <ContextText>이벤트: {detail.events}</ContextText>
        <ContextText>전화번호: {detail.tel_number}</ContextText>
      </ContextContainer>
    </Container>
  ) : (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled>
      <Container ref={scrollViewRef}>
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
              <NullImageContainer>
                <NullImage
                  source={require(`../../assets/drawable-xxhdpi/img_noimage.png`)}
                />
              </NullImageContainer>
            )}
          </Swiper>
        ) : (
          <NullImageContainer>
            <NullImage
              source={require(`../../assets/drawable-xxhdpi/img_noimage.png`)}
            />
          </NullImageContainer>
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
              <TouchableOpacity
                onPress={() =>
                  kakaoLink(
                    title,
                    overview,
                    GetPhoto(backgroundPoster),
                    'id=' + id,
                  )
                }>
                <ShareIcon
                  source={require(`../../assets/drawable-xxhdpi/icon_share_copy.png`)}
                />
              </TouchableOpacity>
              {isWish === 1 ? (
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
              {isLike === 1 ? (
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
          <CommentContainer>
            {comments === undefined ? (
              <ContextText>댓글 ( 0 )</ContextText>
            ) : (
              <>
                <ContextText>댓글 ( {comments.length} )</ContextText>
                {comments.length !== 0
                  ? comments.map((value, index) => (
                      <CommentSlide
                        index={index}
                        commentId={value.id}
                        commentText={value.comment_description}
                        userId={value.users_id}
                        userName={value.user.nickname}
                        time={value.created_at}
                        onRightPress={deleteComment}
                      />
                    ))
                  : null}
              </>
            )}
          </CommentContainer>
        </ContextContainer>
      </Container>

      <InputContainer>
        <Profile
          source={require(`../../assets/drawable-xxhdpi/icon_profile.png`)}
        />
        <Input
          onEndEditing={() => _scrollToBottom()}
          // onFocus={() => _scrollToBottom()}
          onChangeText={handleMsgUpdate}
          value={msg}
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
  );

const _scrollToBottom = () => {
  console.log('_scrollToBottom');
  setTimeout(() => {
    scrollViewRef.current.scrollToEnd({animated: true});
  }, 500);
};

export default DetailPresenter;
