export const ShareLink = {
  navigate: url => {
    console.log('link URL: ' + url); // exampleapp://somepath?id=3
    const paths = url.split('?'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
    if (paths.length > 1) {
      //파라미터가 있다
      const params = paths[1].split('&');
      let id;
      for (let i = 0; i < params.length; i++) {
        let param = params[i].split('='); // [0]: key, [1]:value
        if (param[0] === 'id') {
          id = Number(param[1]); //id=3
        }
      }
      return id;
    }
  },

  handleOpenURL: event => {
    let url = JSON.stringify(event);
    url = url.replace('"', '');
    url = url.replace('"', '');
    console.log('handleOpenURL: ' + url);
    //이벤트 리스너.
    const paths = url.split('?'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
    if (paths.length > 1) {
      //파라미터가 있다
      const params = paths[1].split('&');
      let id;
      for (let i = 0; i < params.length; i++) {
        let param = params[i].split('='); // [0]: key, [1]:value
        if (param[0] === 'id') {
          id = Number(param[1]); //id=3
        }
      }
      return id;
    }
  },
};
