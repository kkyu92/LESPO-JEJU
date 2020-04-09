import React from 'react';
import {withNavigation} from 'react-navigation';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {BG_COLOR, TINT_COLOR, BLACK_COLOR} from '../../../constants/Colors';
import {Platform} from 'react-native';
import Section from '../../../components/Section';
import SearchNo from '../../Main/Search/SearchNo';
import BattleSlide from '../../../components/BattleSlide';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 15;
  border-top-right-radius: 15;
  padding-top: 10;
  padding-bottom: 20;
  margin-top: 20;
  flex: 1;
`;
let itemCount = [];
const MyBattlePresenter = ({loading, chatRoomList, myId, deleteMyBattle}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
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
                        (list.makeUser.userId === myId ||
                          list.joinUser.userId === myId) &&
                        list.deleteHistory[myId] !== myId,
                    )
                    .map(
                      list => (
                        itemCount.push(list),
                        (
                          <BattleSlide
                            roomKey={list.key}
                            myId={myId}
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
                            level={list.level}
                            rate={list.vote_average}
                            sport={list.sports}
                            type={list.battleStyle}
                            date={list.battleDate}
                            area={list.area}
                            memo={list.memo}
                            statusText={list.battleState}
                            battleResult={list.battleResult}
                            endUser={list.endUser}
                            openBox={list.openBox}
                            requestUser={list.requestUser}
                            deleteMyBattle={deleteMyBattle}
                          />
                        )
                      ),
                    )}
                </Section>
              ) : (
                <SearchNo text={'나의 배틀 리스트가 없습니다.'} />
              )
            ) : (
              console.log('null')
            )}
            {itemCount.length > 0 ? null : (
              <SearchNo text={'나의 배틀 리스트가 없습니다.'} />
            )}
          </>
        )}
      </Container>
    </View>
  );

export default withNavigation(MyBattlePresenter);
