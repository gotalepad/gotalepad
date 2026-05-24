import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// FIREBASE CONFIG

const firebaseConfig = {

  apiKey: "AIzaSyD7oMsrTmh0H_RJpWyPoAuvTOly2IKufRQ",
  authDomain: "gotalepad-a00ac.firebaseapp.com",
  projectId: "gotalepad-a00ac",
  storageBucket: "gotalepad-a00ac.firebasestorage.app",
  messagingSenderId: "808127936322",
  appId: "1:808127936322:web:ecfe66f42ca6ac28b9badb",
  measurementId: "G-77ETF93YWT"

};


// INIT FIREBASE

const app = initializeApp(firebaseConfig);


// EXPORT

export const auth = getAuth(app);

export const db = getFirestore(app);