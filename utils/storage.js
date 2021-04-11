require("firebase");
const firebase = require("firebase/app");
require("firebase/storage");
module.exports.initialize = function () {
  // [START storage_initialize]
  // Set the configuration for your app
  // TODO: Replace with your app's config object
  var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    storageBucket: process.env.FIREBASE_STORAGE_KEY,
  };
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = firebase.storage();
  // [END storage_initialize]
};
module.exports.deleteFile = async function (filePath) {
  try {
    const storageRef = firebase.storage().ref();
    const desertRef = storageRef.child(filePath);
    await desertRef.delete();
  } catch (err) {
    console.log(err);
  }
};
module.exports.uploadBytes = async function (bytes, path) {
  try {
    console.log(path);
    const ref = firebase.storage().ref().child(path);
    //var bytes = new Uint8Array(bytes);
    const result = await ref.put(bytes);

    return ref.getDownloadURL();
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports.uploadBase64String = async function (base64String, path) {
  try {
    const ref = firebase.storage().ref().child(path);
    // Data URL string
    var message = base64String;
    //"data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
    await ref.putString(message, "data_url");
    return ref.getDownloadURL();
  } catch (err) {
    return null;
  }
};
module.exports.getDocumentFilePath = function (patient_id, file_name) {
  if (patient_id) {
    return patient_id + "/Documents/" + file_name;
  }
  return "/Documents/" + file_name;
};
module.exports.getImageFilePath = function (patient_id, file_name) {
  if (patient_id) {
    return patient_id + "/Images/" + file_name;
  }
  return "/Images/" + file_name;
};
