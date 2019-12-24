import React from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import Section from "../../../components/Section";
import SubSlide from "../../../components/SubSlide";
import { TINT_COLOR } from "../../../constants/Colors";
import Layout from "../../../constants/Layout";

const View = styled.View`
  background-color: orange;
  flex: 1;
`;

const AdApplyContainer = styled.TouchableOpacity`
  border-radius: 5;
  border-width: 2;
  border-color: ${TINT_COLOR};
  align-items: center;
  justify-content: flex-end;
  margin: 20px;
`;

const AdApplyText = styled.Text`
  color: ${TINT_COLOR};
  font-size: 24px;
  border-radius: 5;
  padding: 5px;
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

const JejuPresenter = ({ loading, getJejuSound }) =>
  loading ? (
    <Loader />
  ) : (
    <View>
      <AdApplyContainer>
        <AdApplyText>광고신청</AdApplyText>
      </AdApplyContainer>
      <Container showsVerticalScrollIndicator={false}>
        {getJejuSound ? (
          <Section horizontal={false} title="제주의 소리">
            {getJejuSound
              .filter(list => list.backdrop_path !== null)
              .map(list => (
                <SubSlide
                  tag={"image"}
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

export default JejuPresenter;
