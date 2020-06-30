import React from 'react';
import 'react-native-gesture-handler';
import {Platform} from 'react-native';
import BackIcon from 'react-native-vector-icons/Feather';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import Notice from '../../../components/Notice';
import SearchNo from '../../Main/Search/SearchNo';
import {BG_COLOR, TINT_COLOR, BLACK_COLOR} from '../../../constants/Colors';

const View = styled.View`
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  flex: 1;
`;

const TopContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${BG_COLOR};
  height: 100px;
`;

const TopBackBtn = styled.TouchableOpacity`
  position: absolute;
  /* background-color: ${BLACK_COLOR}; */
  width: 35px;
  height: 35px;
  top: 40px;
  left: 5px;
`;

const TopText = styled.Text`
  align-self: center;
  text-align: center;
  color: ${TINT_COLOR};
  font-size: 22px;
  font-weight: 600;
  top: 10px;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  flex: 1;
`;

const NoticePresenter = ({
  loading,
  noticeList,
  index,
  navigation,
  handleClickIndex,
}) =>
  loading ? (
    <Loader />
  ) : (
    <>
      {Platform.OS === 'ios' ? (
        <TopContainer>
          <TopBackBtn onPress={() => navigation.goBack()}>
            <BackIcon size={35} name={'chevron-left'} color={`${TINT_COLOR}`} />
          </TopBackBtn>
          <TopText>공지사항</TopText>
        </TopContainer>
      ) : null}
      <View>
        <Container showsVerticalScrollIndicator={false}>
          {noticeList ? (
            noticeList
              .filter(list => list.title !== null)
              .reverse()
              .map(list => (
                <Notice
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  date={list.updated_at}
                  contents={list.description}
                  index={index}
                  handleClickIndex={handleClickIndex}
                />
              ))
          ) : (
            <SearchNo text={'등록된 공지사항이 없습니다.'} />
          )}
        </Container>
      </View>
    </>
  );

export default NoticePresenter;
