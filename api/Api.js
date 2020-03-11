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
const TEST = axios.create({
  baseURL: 'https://withim.net/api/',
});
// POST 사용
export const BASEURL = 'https://www.jejubattle.com/api/';

export const TEST_API = {
  getTest: params => TEST.post('myInfo', params),
};

// LESPO API
export const LESPO_API = {
  login: params => API.post('login/callback', params),
  userDelete: config => API.delete('user/delete', config),
  findPassword: params => API.put('user/password/reset', params),
  changePassword: (params, config) => API.put('user/password', params, config),
  // Notice
  getNotice: () => API.get('notices'),
  // Send E-mail
  sendEmail: (params, config) => API.post('prizes', params, config),

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
  getSearchList: (token, term) =>
    API.get('search', {
      headers: {
        Authorization: token,
      },
      params: {
        query: decodeURIComponent(term),
      },
    }),

  // Battle PlaceList
  getBattlePlaceList: config => API.get('contents/battle-facilities', config),

  // Rating
  getRating: config => API.get('ratings', config),
  addRating: (params, config) => API.post('ratings', params, config),

  // Coin
  getCoin: config => API.get('credits', config),
  insertCoin: (params, config) => API.post('credits/create', params, config),
  deleteCoin: (params, config) => API.post('credits', params, config),

  // Detail
  getDetailItem: (id, config) => API.get('contents/' + id, config),

  // WishList
  addWishList: (params, config) =>
    API.post('contents/wish-lists', params, config),
  deleteWishList: (config, id) =>
    API.delete('contents/wish-lists/' + id, config),
  // Like
  addLike: (params, config) => API.post('contents/likes', params, config),
  deleteLike: (config, id) => API.delete('contents/likes/' + id, config),
  // Comments
  addComment: (params, config) => API.post('contents/comments', params, config),
  deleteComment: (config, id) => API.delete('contents/comments/' + id, config),

  // Contents List
  getReco: config => API.get('contents/recommends', config),
  getFoodList: config => API.get('contents/foods', config),
  getViewList: config => API.get('contents/attractions', config),
  getPlayList: config => API.get('contents/leisure-sports', config),
  getSportsList: config => API.get('contents/sports-facilities', config),

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
