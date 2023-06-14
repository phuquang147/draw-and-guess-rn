const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.listenToFieldChange = functions.firestore
  .document('rooms/7SMRdZZUs4Cp8GF5dWkA')
  .onUpdate((change, context) => {
    const updatedField = change.after.get('endPoint');
    const previousField = change.before.get('endPoint');

    if (updatedField !== previousField) {
      admin.firestore().collection('rooms').doc('7SMRdZZUs4Cp8GF5dWkA').update({
        canJoin: false,
      });
    }

    return null;
  });
