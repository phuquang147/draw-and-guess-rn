const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.listenToRoomStateChange = functions
  .region('asia-east2')
  .firestore.document('rooms/{roomId}')
  .onUpdate((change, context) => {
    const roomId = context.params.roomId;
    const oldRoomState = change.before.get('state');
    const newRoomState = change.after.get('state');
    const roundCount = change.after.get('roundCount');

    // Khi room state chuyển qua choosing
    if (
      (oldRoomState !== newRoomState && newRoomState === 'choosing') ||
      (oldRoomState === 'choosing' && newRoomState === 'choosing')
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
          snapshot.docs[0].ref.update({
            roundCount: admin.firestore.FieldValue.increment(1),
            isChoosing: true,
          });
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
            });
        });
    }

    return null;
  });
