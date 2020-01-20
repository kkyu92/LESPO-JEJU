import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: '25e18c8c0289572a63392742ea79c33f',
    // language: "en-US"
    language: 'ko-KR',
  },
});
const API = axios.create({
  baseURL: 'https://www.jejubattle.com/api/',
});

// POST 사용
export const BASEURL = 'https://www.jejubattle.com/api/';
export const CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    // x-www-form-urlencoded
  },
};

// TODO: LESPO API
export const LESPO_API = {
  getNotice: () => API.get('notices'),
  getRecommends: () => API.get('contents/recommends?category=8'),
  getRecoFood: () => API.get('contents/recommends?category=9'),
  getRecoView: () => API.get('contents/recommends?category=10'),
  getRecoPlay: () => API.get('contents/recommends?category=11'),
};

// FIXME: 이름 그대로 불러다 쓰인다 api 이름 그대로 만들어 쓰면 된다
export const movie = {
  getMovie: id =>
    api.get(`movie/${id}`, {params: {append_to_response: 'videos'}}),
  getUpComing: () => api.get('movie/upcoming'),
  getPopular: () => api.get('movie/popular'),
  getNowPlaying: () => api.get('movie/now_playing'),
  getSearchMovie: term =>
    api.get('search/movie', {
      params: {
        query: encodeURIComponent(term),
      },
    }),
};

export const tv = {
  getShow: id => api.get(`tv/${id}`, {params: {append_to_response: 'videos'}}),
  getPopular: () => api.get('tv/popular'),
  getAiringThisWeek: () => api.get('tv/on_the_air'),
  getAiringToday: () => api.get('tv/airing_today'),
  getSearchTv: term =>
    api.get('search/tv', {
      params: {
        // encodeURIComponent --> uri 형태로 바꿔준다
        query: encodeURIComponent(term),
      },
    }),
};
