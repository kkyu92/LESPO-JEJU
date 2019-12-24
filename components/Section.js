import React from "react";
import styled from "styled-components";
import SubSlide from "./SubSlide";
import PropTypes from "prop-types";

// 먹거리, 볼거리, 놀거리 Sections

const Container = styled.View`
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 20;
  margin-bottom: 15;
`;

const ScrollView = styled.ScrollView``;

const Section = ({ title, children, horizontal = true }) =>
  horizontal ? (
    <Container>
      <Title>{title}</Title>
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Container>
  ) : (
    <Container>
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Container>
  );

Section.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  horizontal: PropTypes.bool,
  title: PropTypes.string.isRequired
};

export default Section;
