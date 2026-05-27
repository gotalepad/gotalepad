import { auth, db } from "./js/firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* REGISTER */
export async function registerUser(username, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    username: username,
    email: email,
    bio: "Penulis di Gotalepad",
    avatar: "https://i.pravatar.cc/300",
    createdAt: serverTimestamp()
  });

  return user;
}

/* LOGIN */
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

/* LOGOUT */
export async function logoutUser() {
  await signOut(auth);
}

/* CEK LOGIN */
export function checkAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

/* WAJIB LOGIN */
export function requireLogin() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}

/* AMBIL USER SEKARANG */
export function getCurrentUser() {
  return auth.currentUser;
}