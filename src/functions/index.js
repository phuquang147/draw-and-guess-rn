const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.listenToRoomStateChange = functions
  .region('asia-east2')
  .firestore.document('rooms/{roomId}')
  .onUpdate(async (change, context) => {
    const roomId = context.params.roomId;
    const oldRoomState = change.before.get('state');
    const newRoomState = change.after.get('state');
    const oldRoundCount = change.before.get('roundCount');
    const newRoundCount = change.after.get('roundCount');
    const oldCorrectCount = change.before.get('correctCount');
    const newCorrectCount = change.after.get('correctCount');
    const endPoint = change.after.get('endPoint');

    // Kiểm tra kết thúc game
    if (oldRoomState !== newRoomState && newRoomState === 'endRound') {
      admin.database().ref(`/rooms/${roomId}-endRound`).set({remaining: 10000});

      let countDownTime = 10000;

      // Countdown
      const interval = setInterval(() => {
        countDownTime -= 1000;

        admin
          .database()
          .ref(`/rooms/${roomId}-endRound`)
          .set({remaining: countDownTime});

        if (countDownTime <= 0) {
          clearInterval(interval);
          admin
            .firestore()
            .collection('rooms')
            .doc(roomId)
            .collection('members')
            .orderBy('points', 'desc')
            .limit(1)
            .get()
            .then(snapshot => {
              if (snapshot.docs[0].data().points >= endPoint) {
                // Reset room
                admin.firestore().collection('rooms').doc(roomId).update({
                  currentMember: null,
                  currentWord: null,
                  correctCount: 0,
                  state: 'endGame',
                });
                // Reset members
                admin
                  .firestore()
                  .collection('rooms')
                  .doc(roomId)
                  .collection('members')
                  .get()
                  .then(snapshot => {
                    snapshot.docs.forEach(doc => {
                      doc.ref.update({
                        isCorrect: false,
                        isChoosing: false,
                        isDrawing: false,
                        points: 0,
                      });
                    });
                  });
                // Reset words
                admin
                  .firestore()
                  .collection('rooms')
                  .doc(roomId)
                  .collection('words')
                  .get()
                  .then(snapshot => {
                    snapshot.docs.forEach(doc => {
                      doc.ref.update({
                        roundCount: 0,
                      });
                    });
                  });
              } else {
                admin.firestore().collection('rooms').doc(roomId).update({
                  state: 'choosing',
                });
              }
            });
        }
      }, 1000);
    }

    if (oldRoomState !== newRoomState && newRoomState === 'endGame') {
      admin.database().ref(`/rooms/${roomId}-endGame`).set({remaining: 15000});

      let countDownTime = 15000;

      // Countdown
      const interval = setInterval(() => {
        countDownTime -= 1000;

        admin
          .database()
          .ref(`/rooms/${roomId}-endGame`)
          .set({remaining: countDownTime});

        if (countDownTime <= 0) {
          clearInterval(interval);
          admin.firestore().collection('rooms').doc(roomId).update({
            state: 'choosing',
          });
        }
      }, 1000);
    }

    // Khi room state chuyển qua choosing
    if (oldRoomState !== newRoomState && newRoomState === 'choosing') {
      // Chọn từ tiếp theo
      admin
        .firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('words')
        .orderBy('roundCount')
        .limit(1)
        .get()
        .then(snapshot => {
          // Cập nhật thông tin phòng
          admin.firestore().collection('rooms').doc(roomId).update({
            currentWord: snapshot.docs[0].ref,
          });
          // Cập nhật từ
          snapshot.docs[0].ref.update({
            roundCount: admin.firestore.FieldValue.increment(1),
          });
        });
      // Chọn người vẽ tiếp theo
      admin
        .firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('members')
        .orderBy('roundCount')
        .limit(1)
        .get()
        .then(snapshot => {
          // Cập nhật thông tin phòng
          admin
            .firestore()
            .collection('rooms')
            .doc(roomId)
            .update({
              currentMember: snapshot.docs[0].ref,
              roundCount: admin.firestore.FieldValue.increment(1),
              correctCount: 0,
            });
          // Cập nhật member
          snapshot.docs[0].ref.update({
            roundCount: admin.firestore.FieldValue.increment(1),
            isChoosing: true,
          });
        });
    }

    //skipping trường hợp
    if (oldRoomState !== newRoomState && newRoomState === 'skipping') {
      admin.firestore().collection('rooms').doc(roomId).update({
        state: 'choosing',
      });
    }

    const resetData = () => {
      // Reset thông tin của member
      admin
        .firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('members')
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            doc.ref.update({
              isCorrect: false,
              isChoosing: false,
              isDrawing: false,
            });
          });
        });
      // Cập nhật trạng thái phòng
      admin
        .firestore()
        .collection('rooms')
        .doc(roomId)
        .update({
          state: 'endRound',
          roundCount: admin.firestore.FieldValue.increment(1),
        });
    };

    // Khi phòng chuyển qua trạng thái playing
    if (oldRoomState !== newRoomState && newRoomState === 'playing') {
      admin
        .database()
        .ref(`/rooms/${roomId}-${newRoundCount}`)
        .set({remaining: 120000});

      let countDownTime = 120000;

      // Countdown
      const interval = setInterval(() => {
        countDownTime -= 1000;

        admin
          .database()
          .ref(`/rooms/${roomId}-${newRoundCount}`)
          .set({remaining: countDownTime});

        if (countDownTime <= 0) {
          {
            admin
              .database()
              .ref(`/rooms/${roomId}-${newRoundCount + 1}`)
              .once('value')
              .then(snapshot => {
                if (!snapshot.val()) {
                  clearInterval(interval);
                  resetData();
                } else {
                  clearInterval(interval);
                }
              });
          }
        }
      }, 1000);
    }

    // Kiểm tra nếu tất cả các thành viên đều trả lời đúng
    if (oldCorrectCount !== newCorrectCount && newCorrectCount !== 0) {
      const collectionRef = admin
        .firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('members');
      const snapshot = await collectionRef.count().get();
      if (newCorrectCount === snapshot.data().count - 1) {
        resetData();
      }
    }

    return null;
  });
