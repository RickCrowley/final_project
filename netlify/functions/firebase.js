const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyAK9jD229sqFGTPk4O67FVMv6XYSVdz5Wo",
  authDomain: "final-project-7c52c.firebaseapp.com",
  projectId: "final-project-7c52c",
  storageBucket: "final-project-7c52c.appspot.com",
  messagingSenderId: "329431634394",
  appId: "1:329431634394:web:bda5a743a2f0913813b0e3"
} // replace

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase