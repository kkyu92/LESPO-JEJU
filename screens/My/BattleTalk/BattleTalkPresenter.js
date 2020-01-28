import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {BG_COLOR, TINT_COLOR, BLACK_COLOR} from '../../../constants/Colors';
import {Platform} from 'react-native';
import Section from '../../../components/Section';
import SearchNo from '../../Main/Search/SearchNo';
import TalkListSlide from '../../../components/TalkListSlide';
import moment from 'moment';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const TitleContainer = styled.View`
  padding: 20px;
`;

const TitleText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 5px;
  margin-right: 5px;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-top: 10;
  padding-bottom: 20;
  flex: 1;
`;

const BattleTalkPresenter = ({loading, chatRoomList, myId}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <TitleContainer>
        <TitleText>나의 배틀상대와{'\n'}대화해보세요.</TitleText>
      </TitleContainer>
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
                        list.makeUser.userId === myId ||
                        list.joinUser.userId === myId,
                    )
                    .map(list => (
                      <TalkListSlide
                        key={list.key}
                        id={
                          list.makeUser.userId === myId
                            ? list.joinUser.userId
                            : list.makeUser.userId
                        }
                        profile={
                          list.makeUser.userId === myId
                            ? list.joinUser.userProfile
                            : list.makeUser.userProfile
                        }
                        name={
                          list.makeUser.userId === myId
                            ? list.joinUser.userName
                            : list.makeUser.userName
                        }
                        date={moment(list.lastRealTime).format('YYYY-MM-DD')}
                        time={moment(list.lastTime)
                          .local()
                          .format('LT')}
                        msg={'dsklfjsfoihehioehitroiebtwboibwe'}
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

export default withNavigation(BattleTalkPresenter);
