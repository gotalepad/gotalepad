import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const storiesContainer = document.getElementById("storiesContainer");
const authArea = document.getElementById("authArea");
const searchInput = document.getElementById("searchInput");

let allStories = [];

if (authArea) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authArea.innerHTML = `
        <a href="./write.html" class="wp-menu">Tulis</a>
        <a href="./library.html" class="wp-menu">Library</a>
        <a href="./profile.html" class="premium-btn">Profile</a>
        <a href="#" id="logoutBtn" class="wp-menu">Keluar</a>
      `;

      document.getElementById("logoutBtn").onclick = async () => {
        await signOut(auth);
        window.location.reload();
      };

    } else {
      authArea.innerHTML = `
        <a href="./write.html" class="wp-menu">Tulis</a>
        <a href="./login.html" class="wp-menu">Login</a>
        <a href="./register.html" class="premium-btn">Daftar</a>
      `;
    }
  });
}

async function loadStories() {
  if (!storiesContainer) return;

  try {
    const q = query(
      collection(db, "stories"),
      orderBy("createdAt", "desc"),
      limit(30)
    );

    const snapshot = await getDocs(q);

    allStories = [];

    snapshot.forEach((docItem) => {
      allStories.push({
        id: docItem.id,
        ...docItem.data()
      });
    });

    renderStories(allStories);

  } catch (error) {
    console.error(error);
    storiesContainer.innerHTML = `
      <p class="empty-text">
        Gagal memuat cerita.
      </p>
    `;
  }
}

function renderStories(stories) {
  if (!storiesContainer) return;

  storiesContainer.innerHTML = "";

  if (stories.length === 0) {
    storiesContainer.innerHTML = `
      <p class="empty-text">
        Belum ada cerita.
      </p>
    `;
    return;
  }

  stories.forEach((story) => {
    storiesContainer.innerHTML += `
      <a href="./story.html?id=${story.id}" class="story-link">
        <div class="story-card">
          <img
            class="story-cover"
            src="${story.coverUrl || story.cover || "https://via.placeholder.com/300x450?text=Cover"}"
            alt="Cover"
          >

          <div class="story-info">
            <div class="story-title">
              ${story.title || "Tanpa Judul"}
            </div>

            <div class="story-author">
              ${story.author || story.email || "Penulis"}
            </div>
          </div>
        </div>
      </a>
    `;
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    if (!keyword) {
      renderStories(allStories);
      return;
    }

    const filtered = allStories.filter((story) => {
      return (
        (story.title || "").toLowerCase().includes(keyword) ||
        (story.author || "").toLowerCase().includes(keyword) ||
        (story.category || "").toLowerCase().includes(keyword)
      );
    });

    renderStories(filtered);
  });
}

loadStories();