import {Dimensions} from 'react-native';

// 화면 크기 받아오기
const {width, height, title, context} = Dimensions.get('window');

// 기본설정 set
export default {
  width,
  height,
  title,
  context,
};
