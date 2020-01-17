import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loader from '../../components/Loader';
import {BG_COLOR, TINT_COLOR, BLACK_COLOR} from '../../constants/Colors';
import PickerSelect from 'react-native-picker-select';
import Layout from '../../constants/Layout';
import {Platform} from 'react-native';
import Section from '../../components/Section';
import SubSlide from '../../components/SubSlide';
import SearchNo from '../Main/Search/SearchNo';
import BattleSlide from '../../components/BattleSlide';

const data = [
  {label: '등록일순', value: 'latest'},
  {label: '가까운순', value: 'nearest'},
  {label: '배틀일순', value: 'battle'},
];

const pickerStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  inputIOS: {
    color: 'white',
    paddingTop: 13,
    paddingHorizontal: 20,
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

const HeaderConatinerPicker = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const AddBattleContainer = styled.TouchableOpacity`
  flex: 1;
  border-radius: 5;
  border-width: 2;
  border-color: ${TINT_COLOR};
  align-items: center;
  justify-content: center;
  margin: 20px;
  padding: 5px;
`;

const AddBattleText = styled.Text`
  color: ${TINT_COLOR};
  font-size: ${Platform.OS === 'ios' ? '14px' : '16px'};
  border-radius: 5;
  padding: 5px;
`;

const PickerContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: ${BG_COLOR};
  border-radius: 5px;
  border-width: 2px;
  border-color: white;
  align-items: center;
  justify-content: center;
  margin: 20px;
`;

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-top: 20;
  padding-bottom: 20;
  flex: 1;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  margin-top: ${Platform.OS === 'ios' ? '35px' : '15px'};
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  /* background-color: goldenrod; */
`;

const HeaderText = styled.Text`
  /* width: 40%; */
  color: ${TINT_COLOR};
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  /* background-color: gainsboro; */
`;

// onSportsChange = selected => {
//   console.log("onSportsChange fun ::: " + selected);
//   sports = selected;
// };

onValueChange = selected => {
  console.log('onValueChange fun ::: ' + selected);
  select = selected;
};

refresh = () => {
  console.log('refresh');
};

// show DATA
const SportsPresenter = ({
  loading,
  listName,
  listChanged,
  chatRoomList,
  onListChanging,
  handleListUpdate,
  myId,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <HeaderContainer>
        <HeaderText>스포츠배틀</HeaderText>
      </HeaderContainer>
      <HeaderConatinerPicker>
        {/* <PickerContainer>
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
        </PickerContainer> */}
        <AddBattleContainer
          onPress={() =>
            navigation.navigate({
              routeName: 'InsertBattle',
            })
          }>
          <AddBattleText>배틀등록</AddBattleText>
        </AddBattleContainer>
      </HeaderConatinerPicker>
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <>
            {chatRoomList ? (
              chatRoomList.length > 0 ? (
                <Section horizontal={false} title="">
                  {chatRoomList
                    .filter(
                      list =>
                        list.makeUser.userId !== myId &&
                        list.chatList === '' &&
                        list.joinUser.userId === '',
                    )
                    .map(list => (
                      <BattleSlide
                        statusText={''}
                        roomKey={list.key}
                        id={list.makeUser.userId}
                        profile={list.makeUser.userProfile}
                        name={list.makeUser.userName}
                        level={list.level}
                        rate={list.makeUser.userRating}
                        sport={list.sports}
                        type={list.battleStyle}
                        date={list.battleDate}
                        area={list.area}
                        memo={list.memo}
                        coinList={false}
                      />
                    ))}
                </Section>
              ) : (
                <SearchNo />
              )
            ) : (
              console.log('null')
            )}
          </>
        )}
      </Container>
    </View>
  );

export default withNavigation(SportsPresenter);
