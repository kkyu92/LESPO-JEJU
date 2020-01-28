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
    'Content-Type': 'application/x-www-form-urlencoded',
    // 'Access-Control-Allow-Origin': '*',
    // x-www-form-urlencoded
  },
};

// TODO: LESPO API
export const LESPO_API = {
  login: params => API.post('login/callback', params),
  // Notice
  getNotice: () => API.get('notices'),

  // Jeju-sound
  getJejuSound: () => API.get('contents/jeju-ads'),
  // Jeju-ad
  getJejuAd: () => API.get('contents/tour-products'),

  // Main
  getMainList: () => API.get('main-list?type=1'),
  getMainFoodList: () => API.get('main-list?type=2'),
  getMainViewList: () => API.get('main-list?type=3'),
  getMainPlayList: () => API.get('main-list?type=4'),

  // Search
  getSearchList: term =>
    API.get('search', {
      params: {
        query: decodeURIComponent(term),
      },
    }),

  // Contents List
  getFoodList: () => API.get('contents/foods'),
  getViewList: () => API.get('contents/attractions'),
  getPlayList: () => API.get('contents/leisure-sports'),

  // Reco
  getRecommends: () => API.get('contents/recommends?category=8'),
  getRecoFood: () => API.get('contents/recommends?category=9'),
  getRecoView: () => API.get('contents/recommends?category=10'),
  getRecoPlay: () => API.get('contents/recommends?category=11'),
  // Food
  getFoodKorea: () => API.get('contents/foods?category=12'),
  getFoodChina: () => API.get('contents/foods?category=13'),
  getFoodAmerica: () => API.get('contents/foods?category=14'),
  getFoodJapan: () => API.get('contents/foods?category=15'),
  getFoodJeju: () => API.get('contents/foods?category=16'),
  getFoodOther: () => API.get('contents/foods?category=17'),
  // View
  getViewFamous: () => API.get('contents/attractions?category=18'),
  getViewTour: () => API.get('contents/attractions?category=19'),
  getViewSea: () => API.get('contents/attractions?category=20'),
  getViewOlleGill: () => API.get('contents/attractions?category=21'),
  getViewMountain: () => API.get('contents/attractions?category=22'),
  getViewOther: () => API.get('contents/attractions?category=23'),
  // Leisure
  getLeisureExtreme: () => API.get('contents/leisure-sports?category=26'),
  getLeisureWaterPark: () => API.get('contents/leisure-sports?category=27'),
  getLeisureThemePark: () => API.get('contents/leisure-sports?category=28'),
  getLeisureFishing: () => API.get('contents/leisure-sports?category=29'),
  getLeisureExperience: () => API.get('contents/leisure-sports?category=30'),
  getLeisureCamping: () => API.get('contents/leisure-sports?category=32'),
  getLeisureOther: () => API.get('contents/leisure-sports?category=33'),
  // Sports
  getSportsBall: () => API.get('contents/sports-facilities?category=34'),
  getSportsBilliards: () => API.get('contents/sports-facilities?category=35'),
  getSportsBowling: () => API.get('contents/sports-facilities?category=36'),
  getSportsHealth: () => API.get('contents/sports-facilities?category=37'),
  getSportsYoga: () => API.get('contents/sports-facilities?category=38'),
  getSportsFight: () => API.get('contents/sports-facilities?category=39'),
  getSportsOther: () => API.get('contents/sports-facilities?category=40'),
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
