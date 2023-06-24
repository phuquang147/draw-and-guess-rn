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
    const roundCount = change.after.get('roundCount');
    const oldCorrectCount = change.before.get('correctCount');
    const newCorrectCount = change.after.get('correctCount');

    // Khi room state chuyển qua choosing
    if (
      oldRoomState !== newRoomState &&
      (newRoomState === 'choosing' || newRoomState === 'skipping')
    ) {
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
          admin.firestore().collection('rooms').doc(roomId).update({
            currentWord: snapshot.docs[0].ref,
          });
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
          admin
            .firestore()
            .collection('rooms')
            .doc(roomId)
            .update({
              currentMember: snapshot.docs[0].ref,
              roundCount: Math.max(
                roundCount,
                snapshot.docs[0].data().roundCount + 1,
              ),
              correctCount: 0,
            });
          snapshot.docs[0].ref.update({
            roundCount: admin.firestore.FieldValue.increment(1),
            isChoosing: true,
          });
        });
    }
    if (oldCorrectCount !== newCorrectCount && newCorrectCount !== 0) {
      const collectionRef = admin
        .firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('members');
      const snapshot = await collectionRef.count().get();
      if (newCorrectCount === snapshot.data().count - 1) {
        admin.firestore().collection('rooms').doc(roomId).update({
          state: 'choosing',
        });
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
      }
    }
    return null;
  });
