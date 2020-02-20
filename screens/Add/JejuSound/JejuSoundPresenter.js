import React from 'react';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import {TINT_COLOR, BG_COLOR} from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import {Platform} from 'react-native';
import PickerSelect from 'react-native-picker-select';

const data = [
  {label: '최신순', value: 'latest'},
  // {label: '가격순', value: 'nearest'},
  {label: '인기순', value: 'likes'},
];

const pickerStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',

  inputIOS: {
    color: 'white',
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingLeft: 55,
    paddingBottom: 12,
  },
  inputAndroid: {
    color: 'white',
  },
  placeholderColor: 'white',
  underline: {borderTopWidth: 0},
  icon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 5,
    borderTopColor: '#00000099',
    borderRightWidth: 5,
    borderRightColor: 'transparent',
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
    top: 20,
    right: 15,
  },
};

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const HeaderConatiner = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
`;

const AdApplyContainer = styled.TouchableOpacity`
  /* flex: 1; */
  width: ${Layout.width / 2 - 40};
  height: 40px;
  border-radius: 5;
  border-width: 2;
  border-color: ${TINT_COLOR};
  align-items: center;
  margin: 20px;
  justify-content: center;
`;

const AdApplyText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 15px;
  border-radius: 5;
  padding: 5px;
`;

const PickerContainer = styled.View`
  /* flex: 1; */
  width: ${Layout.width / 2 - 40};
  height: 40px;
  background-color: ${BG_COLOR};
  border-radius: 5px;
  border-width: 2px;
  border-color: white;
  margin: 20px;
  align-items: center;
  justify-content: center;
`;

const Container = styled.ScrollView`
  background-color: white;
  /* border-top-left-radius: 15;
  border-top-right-radius: 15; */
  padding-left: 20;
  padding-top: 20;
  padding-bottom: 20;
  flex: 1;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  margin-top: ${Platform.OS === 'ios' ? '35px' : '15px'};
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  /* background-color: goldenrod; */
`;

const TitleText = styled.Text`
  /* width: 40%; */
  color: ${TINT_COLOR};
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  /* background-color: gainsboro; */
`;

const JejuPresenter = ({
  loading,
  listName,
  listChanged,
  onListChanging,
  handleListUpdate,
  addFriend,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <TitleContainer>
        <TitleText>이벤트</TitleText>
      </TitleContainer>
      <HeaderConatiner>
        <PickerContainer>
          <PickerSelect
            placeholder={{}}
            items={data}
            // TODO: android
            onValueChange={handleListUpdate}
            // TODO: ios
            onClose={onListChanging}
            // onDonePress={onListChanging}
            doneText={'완료'}
            style={pickerStyle}
            value={listName}
          />
        </PickerContainer>
        <AdApplyContainer onPress={() => addFriend()}>
          <AdApplyText>광고문의</AdApplyText>
        </AdApplyContainer>
      </HeaderConatiner>
      <Container showsVerticalScrollIndicator={false}>
        {listChanged ? (
          listChanged.length > 0 ? (
            <Section horizontal={false} title="제주의 소리">
              {listChanged
                .filter(list => list.id !== null)
                .map(list => (
                  <SubSlide
                    tag={'image'}
                    horizontal={false}
                    key={list.id}
                    id={list.id}
                    backgroundPoster={list.banner.full_filename}
                    poster={list.matched_content_images}
                    title={list.title}
                    overview={list.description}
                    detail={list.detail}
                    // avg={list.vote_average}
                  />
                ))}
            </Section>
          ) : (
            <SearchNo text={'등록된 광고가 없습니다.'} />
          )
        ) : (
          console.log('null')
        )}
      </Container>
    </View>
  );

export default JejuPresenter;
