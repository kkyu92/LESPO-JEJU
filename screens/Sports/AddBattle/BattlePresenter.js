import React from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loader from '../../../components/Loader';
import {
  BG_COLOR,
  TINT_COLOR,
  BLACK_COLOR,
  GREY_COLOR,
} from '../../../constants/Colors';
import PickerSelect from 'react-native-picker-select';
import Layout from '../../../constants/Layout';
import {Platform} from 'react-native';

moment.locale();
var nowAll = moment().format('MMMM Do YYYY, h:mm:ss a');
var nowDate = moment().format('YYYY-MM-DD');
let pickDate = nowDate;
var maxDate = moment(nowDate)
  .add(1, 'years')
  .format('YYYY-MM-DD');
var nowTime = moment().format('hh:mm');
var Time = moment().format('h:mm a');
console.log('NOW ::: ' + nowAll);
console.log('nowDate ::: ' + nowDate);
console.log('maxDate ::: ' + maxDate);

// let battle = {
//   sport: "",
//   area: "",
//   type: "",
//   date: pickDate,
//   level: "",
//   memo: ""
// };

const pickerStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  inputIOS: {
    color: 'grey',
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  inputAndroid: {
    color: 'grey',
  },
  placeholderColor: 'grey',
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

const ViewTitle = styled.Text`
  font-size: 24px;
  color: ${TINT_COLOR};
  align-self: center;
  justify-content: center;
  margin: 10px;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  flex: 1;
`;

const Title = styled.Text`
  font-size: 14px;
  color: ${BLACK_COLOR};
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const PickerContainer = styled.View`
  flex: 1;
  border-radius: 5px;
  border-width: 2px;
  border-color: ${GREY_COLOR};
  align-items: center;
  margin-bottom: 10px;
`;
const MemoContainer = styled.View`
  flex: 1;
  border-radius: 5px;
  border-width: 2px;
  border-color: ${GREY_COLOR};
  align-items: flex-start;
  margin-bottom: 10px;
  height: ${Layout.height / 4};
`;

const Memo = styled.TextInput`
  flex: 1;
  padding: 5px;
  max-height: ${Layout.height / 4};
  width: 100%;
  max-width: 100%;
`;

const StartBtn = styled.TouchableOpacity`
  background-color: ${BG_COLOR};
  border-radius: 10px;
  padding: 15px;
  justify-content: flex-end;
  margin-bottom: 50px;
  margin-top: 20px;
`;

const StartText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 16px;
  align-self: center;
  justify-content: center;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// show DATA
const BattlePresenter = ({
  loading,
  insertBattle,
  date,
  setSportChange,
  setAreaChange,
  setTypeChange,
  setDateChange,
  setLevelChange,
  setMemoChange,
  updateBattle,
  navigation,
}) =>
  loading ? (
    <Loader />
  ) : (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View>
        <ViewTitle>스포츠배틀을 설정하세요!</ViewTitle>
        <Container>
          <Title>원하는 스포츠 선택</Title>
          <PickerContainer>
            <PickerSelect
              placeholder={{}}
              items={sports}
              // TODO: android & ios
              onValueChange={setSportChange}
              // TODO: only ios
              //   onClose={value => setSportChange(value)}
              doneText={'완료'}
              style={pickerStyle}
              // value={sport}
            />
          </PickerContainer>

          <Title>지역선택</Title>
          <PickerContainer>
            <PickerSelect
              flex={1}
              placeholder={{}}
              items={areas}
              // TODO: android
              onValueChange={setAreaChange}
              // TODO: ios
              //   onClose={value => setAreaChange(value)}
              doneText={'완료'}
              style={pickerStyle}
              // value={listName}
            />
          </PickerContainer>

          <Title>개인전 or 팀전</Title>
          <PickerContainer>
            <PickerSelect
              placeholder={{}}
              items={types}
              // TODO: android
              onValueChange={setTypeChange}
              // TODO: ios
              //   onClose={value => setTypeChange(value)}
              doneText={'완료'}
              style={pickerStyle}
              // value={listName}
            />
          </PickerContainer>

          <Title>이용 일자 선택</Title>

          <PickerContainer>
            <DatePicker
              style={{width: '100%'}}
              date={date}
              mode="date"
              placeholder="이용 일자를 선택해주세요."
              format="YYYY-MM-DD"
              minDate={nowDate}
              maxDate={maxDate}
              confirmBtnText="확인"
              cancelBtnText="취소"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  right: 0,
                  top: 4,
                  marginRight: 10,
                },
                dateInput: {
                  width: '100%',
                  backgroundColor: null,
                  borderWidth: 0,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={getDate => {
                setDateChange(getDate), (date = getDate);
              }}
            />
          </PickerContainer>

          <Title>실력 선택</Title>
          <PickerContainer>
            <PickerSelect
              placeholder={{}}
              items={leveles}
              // TODO: android
              onValueChange={setLevelChange}
              // TODO: ios
              //   onClose={value => setLevelChange(value)}
              doneText={'완료'}
              style={pickerStyle}
              // value={listName}
            />
          </PickerContainer>

          <Title>메모</Title>
          <MemoContainer>
            <Memo
              onChangeText={setMemoChange}
              returnKeyType={'next'}
              // placeholder="댓글 달기..."
              placeholderTextColor={GREY_COLOR}
              // onSubmitEditing={onSubmitEditing}
              autoCorrect={false}
              multiline={true}
              textAlignVertical={'top'}
            />
          </MemoContainer>
          <StartBtn onPress={() => navigation.goBack(null)}>
            <StartText>시작하기</StartText>
          </StartBtn>
        </Container>
      </View>
    </KeyboardAvoidingView>
  );
handleUpdate = navigation => {
  handleGoBack(navigation);
};
handleGoBack = navigation => {
  navigation.goBack(null);
};

const sports = [
  {label: '당구', value: '당구'},
  {label: '농구', value: '농구'},
  {label: '축구', value: '축구'},
  {label: '볼링', value: '볼링'},
  {label: '골프', value: '골프'},
  {label: '배드민턴', value: '배드민턴'},
];

const areas = [
  {label: '당구', value: '당구'},
  {label: '농구', value: '농구'},
  {label: '축구', value: '축구'},
  {label: '볼링', value: '볼링'},
  {label: '골프', value: '골프'},
  {label: '배드민턴', value: '배드민턴'},
];
const types = [
  {label: '개인전', value: '개인전'},
  {label: '팀전', value: '팀전'},
];

const leveles = [
  {label: '초보', value: '초보'},
  {label: '중수', value: '중수'},
  {label: '고수', value: '고수'},
  {label: '초고수', value: '초고수'},
];

export default withNavigation(BattlePresenter);
