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
          // Kiểm tra nếu đủ điểm thắng thì endgame
          admin
            .firestore()
            .collection(`rooms/${roomId}/members`)
            .orderBy('points', 'desc')
            .limit(1)
            .get()
            .then(snapshot => {
              if (snapshot.docs[0].data().points >= endPoint) {
                admin.firestore().doc(`rooms/${roomId}`).update({
                  state: 'endGame',
                });
              } else {
                admin.firestore().doc(`rooms/${roomId}`).update({
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

          // Reset members
          admin
            .firestore()
            .collection(`rooms/${roomId}/members`)
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
          // Reset room
          admin.firestore().collection('rooms').doc(roomId).update({
            currentMember: null,
            currentWord: null,
            correctCount: 0,
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
        .collection(`rooms/${roomId}/words`)
        .orderBy('roundCount')
        .limit(1)
        .get()
        .then(snapshot => {
          // Cập nhật thông tin phòng
          admin.firestore().doc(`rooms/${roomId}`).update({
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
        .collection(`rooms/${roomId}/members`)
        .orderBy('roundCount')
        .limit(1)
        .get()
        .then(snapshot => {
          // Cập nhật thông tin phòng
          admin
            .firestore()
            .doc(`rooms/${roomId}`)
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
      admin.firestore().doc(`rooms/${roomId}`).update({
        state: 'choosing',
      });
    }

    const resetMembers = () => {
      // Reset thông tin của member
      admin
        .firestore()
        .collection(`rooms/${roomId}/members`)
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
    };

    const resetData = () => {
      resetMembers();
      // Cập nhật trạng thái phòng
      admin.firestore().doc(`rooms/${roomId}`).update({
        state: 'endRound',
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
                  admin.firestore
                    .doc(`rooms/${roomId}/members`)
                    .count()
                    .get()
                    .then(snapshot => {
                      if (snapshot.data().count >= 2) resetData();
                    });
                } else {
                  clearInterval(interval);
                }
              });
          }
        }
      }, 1000);
    }

    // Khi phòng chuyển qua trạng thái waiting
    if (oldRoomState !== newRoomState && newRoomState === 'waiting') {
      resetMembers();
      // Reset phòng
      admin.firestore().doc(`rooms/${roomId}`).update({
        correctCount: 0,
      });
    }

    // Kiểm tra nếu tất cả các thành viên đều trả lời đúng
    if (oldCorrectCount !== newCorrectCount && newCorrectCount !== 0) {
      const collectionRef = admin
        .firestore()
        .collection(`rooms/${roomId}/members`);

      const snapshot = await collectionRef.count().get();
      if (newCorrectCount === snapshot.data().count - 1) {
        resetData();
      }
    }

    return null;
  });

exports.listenToMemberUpdate = functions
  .region('asia-east2')
  .firestore.document('rooms/{roomId}/members/{memberId}')
  .onUpdate((change, context) => {
    const {roomId, memberId} = context.params;
    const oldIsOnline = change.before.get('isOnline');
    const newIsOnline = change.after.get('isOnline');
    const isHost = change.after.get('isHost');
    const isDrawing = change.after.get('isDrawing');
    const isChoosing = change.after.get('isChoosing');

    if (oldIsOnline !== newIsOnline && !newIsOnline) {
      if (isHost)
        admin
          .firestore()
          .collection(`rooms/${roomId}/members`)
          .where('uid', '!=', memberId)
          .limit(1)
          .get()
          .then(snapshot => {
            snapshot.docs[0].ref.update({isHost: true});
          });

      admin
        .firestore()
        .doc(`rooms/${roomId}/members/${memberId}`)
        .delete()
        .then(() => {
          // Kiểm tra số lượng member để xóa room
          admin
            .firestore()
            .collection(`rooms/${roomId}/members`)
            .count()
            .get()
            .then(snapshot => {
              if (snapshot.data().count === 0) {
                admin
                  .firestore()
                  .collection(`rooms/${roomId}/words`)
                  .get()
                  .then(snapshot => {
                    for (const doc of snapshot.docs) {
                      doc.ref.delete();
                    }
                  });
                admin
                  .firestore()
                  .collection(`rooms/${roomId}/answers`)
                  .get()
                  .then(snapshot => {
                    for (const doc of snapshot.docs) {
                      doc.ref.delete();
                    }
                  });
                admin.firestore().doc(`rooms/${roomId}`).delete();
              } else if (snapshot.data().count === 1) {
                admin
                  .firestore()
                  .doc(`rooms/${roomId}`)
                  .update({state: 'waiting'});
              } else {
                // Nếu member đang chọn từ hoặc vẽ thì chuyển thành skipping
                if (isDrawing || isChoosing) {
                  admin
                    .firestore()
                    .doc(`rooms/${roomId}`)
                    .update({state: 'skipping'});
                }
              }
            });
        });
    }
  });
