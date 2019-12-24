import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PhotoUri from "../api/PhotoUri";

const Image = styled.Image`
  width: 110px;
  height: 160px;
  border-radius: 15;
`;

const Poster = ({ path }) => <Image source={{ uri: PhotoUri(path) }} />;

// Poster.propTypes = {
//   path: PropTypes.string
// };

export default Poster;
