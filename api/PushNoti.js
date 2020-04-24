import {RESPONSE_OK, CHAT_ROOM_IN, ROOM_OUT} from '../constants/Strings';
import firebase from 'firebase';

export const firebase_server_key =
  'AAAABOeF95E:APA91bGCKfJwCOUeYC8QypsS7yCAtR8ZOZf_rAj1iRK_OvIB3mYXYnva4DAY28XmUZA1GpXsdp1eRf9rPeuIedr7eX_7yFWbL-C_4JfVGSFGorCdzjOA0AyYPxB83M8TTAfUj62tUZhH';

export const FirebasePush = {
  sendToServerBattleTalk: async (
    roomKey,
    receiverId,
    senderId,
    senderName,
    senderProfile,
    msg,
    date,
    token,
  ) => {
    let makerIn;
    let joinerIn;
    let alarmValue;

    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
    var checkJoiner = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/joinUser/userIn');
    checkJoiner.once('value', dataSnapshot => {
      joinerIn = JSON.stringify(dataSnapshot);
    });

    await firebase
      .database()
      .ref('FcmNotiPush/' + receiverId)
      .once('value', data => {
        alarmValue = JSON.stringify(data);
        if (
          alarmValue === 'false' &&
          (makerIn !== 'true' || joinerIn !== 'true')
        ) {
          console.log('\n\n-----NOTI-----\n안날림\n\n');
        } else {
          console.log('\n\n-----NOTI-----\n날림\n\n');
          // 읽음처리
          if (msg === CHAT_ROOM_IN) {
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + firebase_server_key,
              },
              body: JSON.stringify({
                registration_ids: [token],
                notification: {
                  title: senderName,
                  body: senderName + '님이 채팅방에 참여했습니다.',
                },
                data: {
                  roomKey: roomKey,
                  id: senderId,
                  name: senderName,
                  profile: senderProfile,
                  msg: msg,
                  date: date,
                },
              }),
            });
          } else if (msg === RESPONSE_OK) {
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + firebase_server_key,
              },
              body: JSON.stringify({
                registration_ids: [token],
                notification: {
                  title: senderName,
                  body: '배틀을 수락합니다.',
                },
                data: {
                  roomKey: roomKey,
                  id: senderId,
                  name: senderName,
                  profile: senderProfile,
                  msg: msg,
                  date: date,
                },
              }),
            });
          } else {
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + firebase_server_key,
              },
              body: JSON.stringify({
                registration_ids: [token],
                notification: {
                  title: senderName,
                  body: msg,
                },
                data: {
                  roomKey: roomKey,
                  id: senderId,
                  name: senderName,
                  profile: senderProfile,
                  msg: msg,
                  date: date,
                },
              }),
            });
          }
        }
      });
  },
  //TODO: if(alarm off) X
  sendToServerMyBattleDetail: async (
    roomKey,
    receiverId,
    senderId,
    senderName,
    senderProfile,
    msg,
    token,
  ) => {
    let makerIn;
    let joinerIn;
    let alarmValue;

    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
    var checkJoiner = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/joinUser/userIn');
    checkJoiner.once('value', dataSnapshot => {
      joinerIn = JSON.stringify(dataSnapshot);
    });

    await firebase
      .database()
      .ref('FcmNotiPush/' + receiverId)
      .once('value', data => {
        alarmValue = JSON.stringify(data);
        if (alarmValue === 'true') {
          console.log('\n\n-----NOTI-----\n날림\n\n');
          if (msg === RESPONSE_OK) {
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + firebase_server_key,
              },
              body: JSON.stringify({
                registration_ids: [token],
                notification: {
                  title: senderName,
                  body: '배틀을 수락합니다.',
                },
                data: {
                  roomKey: roomKey,
                  id: senderId,
                  name: senderName,
                  profile: senderProfile,
                  msg: msg,
                },
              }),
            });
          } else {
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + firebase_server_key,
              },
              body: JSON.stringify({
                registration_ids: [token],
                notification: {
                  title: senderName,
                  body: msg,
                },
                data: {
                  roomKey: roomKey,
                  id: senderId,
                  name: senderName,
                  profile: senderProfile,
                  msg: msg,
                },
              }),
            });
          }
        } else {
          if (makerIn === 'true' || joinerIn === 'true') {
            console.log('\n\n-----NOTI-----\n날림\n\n');
            if (msg === RESPONSE_OK) {
              fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'key=' + firebase_server_key,
                },
                body: JSON.stringify({
                  registration_ids: [token],
                  notification: {
                    title: senderName,
                    body: '배틀을 수락합니다.',
                  },
                  data: {
                    roomKey: roomKey,
                    id: senderId,
                    name: senderName,
                    profile: senderProfile,
                    msg: msg,
                  },
                }),
              });
            } else {
              fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'key=' + firebase_server_key,
                },
                body: JSON.stringify({
                  registration_ids: [token],
                  notification: {
                    title: senderName,
                    body: msg,
                  },
                  data: {
                    roomKey: roomKey,
                    id: senderId,
                    name: senderName,
                    profile: senderProfile,
                    msg: msg,
                  },
                }),
              });
            }
          } else {
            console.log('\n\n-----NOTI-----\n안날림\n\n');
          }
        }
      });
  },
  sendToServerRoomOut: async (
    roomKey,
    receiverId,
    senderId,
    senderName,
    senderProfile,
    msg,
    date,
    token,
  ) => {
    let makerIn;
    let joinerIn;
    let alarmValue;

    var checkMaker = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/makeUser/userIn');
    checkMaker.once('value', dataSnapshot => {
      makerIn = JSON.stringify(dataSnapshot);
    });
    var checkJoiner = firebase
      .database()
      .ref('chatRoomList/' + roomKey + '/joinUser/userIn');
    checkJoiner.once('value', dataSnapshot => {
      joinerIn = JSON.stringify(dataSnapshot);
    });

    await firebase
      .database()
      .ref('FcmNotiPush/' + receiverId)
      .once('value', data => {
        alarmValue = JSON.stringify(data);
        if (makerIn === 'true' || joinerIn === 'true') {
          console.log('\n\n-----NOTI-----\n날림\n\n');
          if (msg === ROOM_OUT) {
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + firebase_server_key,
              },
              body: JSON.stringify({
                registration_ids: [token],
                notification: {
                  title: '',
                  body: senderName + '님이 채팅방을 나갔습니다.',
                },
                data: {
                  roomKey: roomKey,
                  id: senderId,
                  name: senderName,
                  profile: senderProfile,
                  msg: msg,
                  date: date,
                },
              }),
            });
          }
        } else {
          if (alarmValue === 'true') {
            console.log('\n\n-----NOTI-----\n날림\n\n');
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + firebase_server_key,
              },
              body: JSON.stringify({
                registration_ids: [token],
                notification: {
                  title: '',
                  body: senderName + '님이 채팅방을 나갔습니다.',
                },
                data: {
                  roomKey: roomKey,
                  id: senderId,
                  name: senderName,
                  profile: senderProfile,
                  msg: msg,
                  date: date,
                },
              }),
            });
          } else {
            console.log('\n\n-----NOTI-----\n안날림\n\n');
          }
        }
      });
  },
};
