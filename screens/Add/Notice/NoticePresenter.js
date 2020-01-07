import React from 'react';
import PickerSelect from 'react-native-picker-select';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import {TINT_COLOR} from '../../../constants/Colors';
import {Platform} from 'react-native';
import Notice from '../../../components/Notice';

const View = styled.View`
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  flex: 1;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  flex: 1;
`;

const NoticePresenter = ({loading, noticeList, index, handleClickIndex}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <Container showsVerticalScrollIndicator={false}>
        {noticeList
          ? noticeList
              .filter(list => list.overview !== null)
              .map(list => (
                <Notice
                  key={list.id}
                  id={list.id}
                  title={list.name}
                  date={list.vote_average}
                  contents={list.overview}
                  index={index}
                  handleClickIndex={handleClickIndex}
                />
              ))
          : null}
      </Container>
    </View>
  );

export default NoticePresenter;
