import React from 'react';
import 'react-native-gesture-handler';
import {Platform} from 'react-native';
import BackIcon from 'react-native-vector-icons/Feather';
import styled from 'styled-components';
import {Switch} from 'react-native-switch';
import Loader from '../../../components/Loader';
import {
  GREY_COLOR,
  BG_COLOR,
  TINT_COLOR,
  BLACK_COLOR,
} from '../../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Linking} from 'react-native';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  background-color: white;
`;

const BtnContainer = styled.TouchableOpacity`
  flex-direction: row;
  border-color: ${GREY_COLOR};
  border-bottom-width: 0.5;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const SwitchContainer = styled.View`
  flex-direction: row;
  border-color: ${GREY_COLOR};
  border-bottom-width: 0.5;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const Text = styled.Text`
  color: black;
  font-size: 20px;
  align-items: center;
`;

const VersionText = styled.Text`
  color: ${BG_COLOR};
  font-size: 20px;
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

const SettingPresenter = ({loading, id, alarm, alarmChange, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <>
      {Platform.OS === 'ios' ? (
        <TopContainer>
          <TopBackBtn onPress={() => navigation.goBack()}>
            <BackIcon size={35} name={'chevron-left'} color={`${TINT_COLOR}`} />
          </TopBackBtn>
          <TopText>설정</TopText>
        </TopContainer>
      ) : null}
      <View>
        <Container>
          <SwitchContainer>
            <Text>알림설정</Text>
            <Switch
              value={alarm}
              onValueChange={val => alarmChange(val, id)}
              disabled={false}
              activeText={'On'}
              inActiveText={'Off'}
              circleSize={30}
              barHeight={30}
              circleBorderWidth={1}
              backgroundActive={BG_COLOR}
              backgroundInactive={GREY_COLOR}
              circleActiveColor={TINT_COLOR}
              circleInActiveColor={TINT_COLOR}
              // changeValueImmediately={true}
              // renderInsideCircle={} // custom component to render inside the Switch circle (Text, Image, etc.)
              changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
              innerCircleStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: BG_COLOR,
              }} // style for inner animated circle for what you (may) be rendering inside the circle
              outerCircleStyle={{}} // style for outer animated circle
              renderActiveText={false}
              renderInActiveText={false}
              switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
              switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
              switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
            />
          </SwitchContainer>

          <BtnContainer
            onPress={() =>
              Linking.openURL('https://www.jejubattle.com/privacy')
            }>
            <Text>개인정보, 이용약관</Text>
            <Icon
              size={Platform.OS === 'ios' ? 30 : 30}
              name={'shield-account-outline'}
              color={`${BG_COLOR}`}
            />
          </BtnContainer>

          <BtnContainer>
            <Text>버전정보</Text>
            <VersionText>1.1.0</VersionText>
          </BtnContainer>
        </Container>
      </View>
    </>
  );

export default SettingPresenter;
