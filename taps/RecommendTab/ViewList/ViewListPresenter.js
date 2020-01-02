import React from "react";
import { withNavigation } from "react-navigation";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import { BG_COLOR, TINT_COLOR, BLACK_COLOR } from "../../../constants/Colors";
import Layout from "../../../constants/Layout";
import { Platform } from "react-native";
import Section from "../../../components/Section";
import SubSlide from "../../../components/SubSlide";
import SearchNo from "../../../screens/Main/Search/SearchNo";

const MapView = styled.View`
  margin-top: 4px;
  height: ${Layout.height / 3};
  background-color: ${TINT_COLOR};
  border-top-left-radius: 15;
  border-top-right-radius: 15;
`;

const View = styled.View`
  background-color: ${BG_COLOR};
  flex: 1;
`;

const Container = styled.ScrollView`
  background-color: white;
  padding-top: 10;
  padding-bottom: 20;
  padding-left: 20;
  flex: 1;
`;

// show DATA
const ViewListPresenter = ({ loading, listChanged, navigation }) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <MapView></MapView>
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <>
            {listChanged ? (
              listChanged.length > 0 ? (
                <Section horizontal={false} title="">
                  {listChanged
                    .filter(list => list.backdrop_path !== null)
                    .map(list => (
                      <SubSlide
                        tag={"notag"}
                        horizontal={false}
                        key={list.id}
                        id={list.id}
                        backgroundPoster={list.backdrop_path}
                        title={list.title}
                        avg={list.vote_average}
                        overview={list.overview}
                      />
                    ))}
                </Section>
              ) : (
                <SearchNo handleGetSearchText={searchTerm} />
              )
            ) : (
              console.log("null")
            )}
          </>
        )}
      </Container>
    </View>
  );

export default withNavigation(ViewListPresenter);
