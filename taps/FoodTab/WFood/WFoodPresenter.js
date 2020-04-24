import React from 'react';
import {withNavigation, FlatList} from 'react-navigation';
import styled from 'styled-components';
import Loader from '../../../components/Loader';
import {BG_COLOR, TINT_COLOR, GREY_COLOR3} from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import {Platform, Alert} from 'react-native';
import Section from '../../../components/Section';
import SubSlide from '../../../components/SubSlide';
import SearchNo from '../../../screens/Main/Search/SearchNo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const MapBtn = styled.TouchableOpacity`
  width: ${Layout.width / 3};
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  padding: 5px;
  flex-direction: row;
  border-radius: 10px;
  border-color: ${TINT_COLOR};
  border-width: 1px;
  align-items: center;
  align-self: flex-end;
  justify-content: space-around;
`;
const MapText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 14px;
`;

const Container = styled.View`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: white;
  padding-left: 20;
  flex: 1;
`;
const mainState = 14;
// show DATA
const WFoodPresenter = ({loading, listChanged, locations, navigation}) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      {listChanged.length > 0 ? (
        <MapBtn
          onPress={() =>
            navigation.navigate({
              routeName: 'Map',
              params: {listChanged, locations, mainState},
            })
          }>
          <MapText>지도로 보기</MapText>
          <Icon size={30} name={'map-marker-radius'} color={`${TINT_COLOR}`} />
        </MapBtn>
      ) : (
        <MapBtn onPress={() => Alert.alert('등록된 리스트가 없습니다.')}>
          <MapText>등록리스트 없음</MapText>
        </MapBtn>
      )}
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            scrollIndicatorInsets={{right: 1}}
            data={listChanged}
            renderItem={list => (
              <>
                {listChanged ? (
                  listChanged.length > 0 ? (
                    <Section horizontal={false} title="">
                      {JSON.stringify(list.item.matched_content_images) ===
                      '[]' ? (
                        <SubSlide
                          tag={'notag'}
                          horizontal={false}
                          key={list.item.id}
                          id={list.item.id}
                          backgroundPoster={'no'}
                          poster={'no'}
                          title={list.item.title}
                          overview={list.item.description}
                          detail={list.item.detail}
                          avg={list.item.like_count}
                        />
                      ) : (
                        <SubSlide
                          tag={'notag'}
                          horizontal={false}
                          key={list.item.id}
                          id={list.item.id}
                          backgroundPoster={
                            list.item.matched_content_images[0].full_filename
                          }
                          poster={list.item.matched_content_images}
                          title={list.item.title}
                          overview={list.item.description}
                          detail={list.item.detail}
                          avg={list.item.like_count}
                        />
                      )}
                    </Section>
                  ) : (
                    <SearchNo text={'등록된 리스트가 없습니다.'} />
                  )
                ) : (
                  console.log('null')
                )}
              </>
            )}
          />
        )}
      </Container>
    </View>
  );

export default withNavigation(WFoodPresenter);
