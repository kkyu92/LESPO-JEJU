import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import {Switch} from 'react-native-switch';
import Loader from '../../../components/Loader';
import {
  GREY_COLOR,
  BG_COLOR,
  TINT_COLOR,
  GREY_COLOR2,
  TINT_COLOR2,
  GREY_COLOR3,
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

const SettingPresenter = ({loading, alarm, alarmChange, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      {/* <HeaderContainer>
        <HeaderText>설정</HeaderText>
      </HeaderContainer> */}
      <Container>
        <SwitchContainer>
          <Text>알림설정</Text>
          <Switch
            value={alarm}
            onValueChange={val => alarmChange(val)}
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
          onPress={() => Linking.openURL('https://www.jejubattle.com/privacy')}>
          <Text>개인정보, 이용약관</Text>
          <Icon
            size={Platform.OS === 'ios' ? 30 : 30}
            name={'shield-account-outline'}
            color={`${BG_COLOR}`}
          />
        </BtnContainer>

        <BtnContainer>
          <Text>버전정보</Text>
          <VersionText>1.0.19</VersionText>
        </BtnContainer>
      </Container>
    </View>
  );

export default withNavigation(SettingPresenter);
