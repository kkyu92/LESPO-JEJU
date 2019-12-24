import React from "react";
import PickerSelect from "react-native-picker-select";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import Section from "../../../components/Section";
import SubSlide from "../../../components/SubSlide";
import { TINT_COLOR } from "../../../constants/Colors";
import { Platform } from "react-native";

let select = "";

const state = {
  selected: "~~"
};

const data = [
  { label: "가까운순", value: "nearest" },
  { label: "좋아요순", value: "likes" },
  { label: "등록일순", value: "latest" }
];

const pickerStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",

  inputIOS: {
    color: "white",
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingLeft: 55,
    paddingBottom: 12
  },
  inputAndroid: {
    color: "white"
  },
  placeholderColor: "white",
  underline: { borderTopWidth: 0 },
  icon: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 5,
    borderTopColor: "#00000099",
    borderRightWidth: 5,
    borderRightColor: "transparent",
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
    width: 0,
    height: 0,
    top: 20,
    right: 15
  }
};

const View = styled.View`
  background-color: orange;
  flex: 1;
`;

const HeaderConatiner = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const AdApplyContainer = styled.TouchableOpacity`
  flex: 1;
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

const PickerContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: orange;
  border-radius: 5px;
  border-width: 2px;
  border-color: white;
  margin: 20px;
  align-items: center;
  justify-content: center;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-left: 20;
  padding-top: 20;
  padding-bottom: 20;
  flex: 1;
`;

onValueChange = selected => {
  console.log("onValueChange fun ::: " + selected);
  select = selected;
};

const JejuGiftPresenter = ({ loading, getJejuSound }) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <HeaderConatiner>
        <PickerContainer>
          <PickerSelect
            placeholder={{}}
            items={data}
            // TODO: android
            onValueChange={value => onValueChange(value)}
            // TODO: ios
            onDonePress={value => console.log("ios ::: " + select)}
            doneText={"완료"}
            style={pickerStyle}
          />
        </PickerContainer>
        <AdApplyContainer>
          <AdApplyText>광고신청</AdApplyText>
        </AdApplyContainer>
      </HeaderConatiner>
      <Container>
        {getJejuSound ? (
          <Section horizontal={false} title="관광 상품">
            {getJejuSound
              .filter(list => list.backdrop_path !== null)
              .map(list => (
                <SubSlide
                  tag={"tag"}
                  horizontal={false}
                  key={list.id}
                  id={list.id}
                  backgroundPoster={list.backdrop_path}
                  title={list.name}
                  avg={list.vote_average}
                  overview={list.overview}
                />
              ))}
          </Section>
        ) : null}
      </Container>
    </View>
  );

export default JejuGiftPresenter;
