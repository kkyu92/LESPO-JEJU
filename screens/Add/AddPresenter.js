import React from "react";
import { withNavigation } from "react-navigation";
import styled from "styled-components";
import PropTypes from "prop-types";
import Loader from "../../components/Loader";
import { GREY_COLOR } from "../../constants/Colors";

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const BtnContainer = styled.TouchableOpacity`
  flex-direction: row;
  border-color: ${GREY_COLOR};
  border-bottom-width: 0.5;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const Text = styled.Text`
  color: black;
  font-size: 25;
  align-items: center;
`;

const BtnImg = styled.Image`
  width: 25px;
  height: 25px;
`;

// show DATA
const AddPresenter = ({ loading, navigation }) =>
  loading ? (
    <Loader />
  ) : (
    <Container>
      <BtnContainer
        onPress={() =>
          navigation.navigate({
            routeName: "JejuSound"
          })
        }
      >
        <Text>제주의 소리</Text>
        <BtnImg
          source={require(`../../assets/drawable-xxhdpi/icon_island.png`)}
        />
      </BtnContainer>

      <BtnContainer
        onPress={() =>
          navigation.navigate({
            routeName: "JejuGift"
          })
        }
      >
        <Text>관광상품</Text>
        <BtnImg
          source={require(`../../assets/drawable-xxhdpi/icon_gift.png`)}
        />
      </BtnContainer>

      <BtnContainer>
        <Text>고객센터</Text>
        <BtnImg
          source={require(`../../assets/drawable-xxhdpi/icon_callcenter.png`)}
        />
      </BtnContainer>

      <BtnContainer>
        <Text>공지사항</Text>
        <BtnImg
          source={require(`../../assets/drawable-xxhdpi/icon_notice.png`)}
        />
      </BtnContainer>

      <BtnContainer>
        <Text>설정</Text>
        <BtnImg
          source={require(`../../assets/drawable-xxhdpi/icon_setting.png`)}
        />
      </BtnContainer>
    </Container>
  );

export default withNavigation(AddPresenter);
