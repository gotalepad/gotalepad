import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const usernameEl = document.getElementById("profileUsername");
const bioEl = document.getElementById("profileBio");
const avatarEl = document.getElementById("profileAvatar");
const storyCountEl = document.getElementById("storyCount");
const storiesContainer = document.getElementById("profileStories");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadProfile(user);
  loadStories(user.uid);
});

async function loadProfile(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      usernameEl.innerText = data.username || "Gotalepad Writer";
      bioEl.innerText = data.bio || "Belum ada bio.";

      if (data.avatar) {
        avatarEl.src = data.avatar;
      }
    } else {
      usernameEl.innerText = user.email;
      bioEl.innerText = "Penulis di Gotalepad";
    }

  } catch (err) {
    console.error(err);
    usernameEl.innerText = "Gagal memuat profil";
  }
}

async function loadStories(uid) {
  storiesContainer.innerHTML = "Loading...";

  try {
    const q = query(
      collection(db, "stories"),
      where("uid", "==", uid)
    );

    const snapshot = await getDocs(q);

    storyCountEl.innerText = snapshot.size;
    storiesContainer.innerHTML = "";

    if (snapshot.empty) {
      storiesContainer.innerHTML = `
        <p class="empty-text">Belum ada cerita.</p>
      `;
      return;
    }

    snapshot.forEach((docItem) => {
      const story = docItem.data();

      storiesContainer.innerHTML += `
        <a href="story.html?id=${docItem.id}" class="story-link">
          <div class="wp-story-card">
            <img src="${story.cover || "https://via.placeholder.com/300x450?text=No+Cover"}">

            <div class="wp-story-info">
              <h3>${story.title}</h3>
              <p>${story.author || story.email}</p>

              <div class="story-tags">
                <span>${story.category || "Novel"}</span>
              </div>

              <div class="story-meta">
                <span>👁 ${story.views || 0}</span>
                <span>⭐ 0</span>
              </div>
            </div>
          </div>
        </a>
      `;
    });

  } catch (err) {
    console.error(err);
    storiesContainer.innerHTML = "Gagal memuat cerita.";
  }
}

if (logoutBtn) {
  logoutBtn.onclick = async () => {
    await signOut(auth);
    window.location.href = "login.html";
  };
}