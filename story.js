import { auth, db } from "./js/firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const storyId = params.get("id");

const storyCover = document.getElementById("storyCover");
const storyTitle = document.getElementById("storyTitle");
const storyAuthor = document.getElementById("storyAuthor");
const storyDescription = document.getElementById("storyDescription");
const chapterList = document.getElementById("chapterList");
const chapterCount = document.getElementById("chapterCount");
const voteCount = document.getElementById("voteCount");
const readCount = document.getElementById("readCount");

const startReadBtn = document.getElementById("startReadBtn");
const addChapterLink = document.getElementById("addChapterLink");
const libraryBtn = document.getElementById("libraryBtn");
const voteBtn = document.getElementById("voteBtn");

let currentUser = null;
let chapters = [];

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

if (!storyId) {
  storyTitle.innerText = "Cerita tidak ditemukan";
} else {
  addChapterLink.href = `add-chapter.html?id=${storyId}`;
  loadStory();
  loadChapters();
  loadVotes();
}

async function loadStory() {
  try {
    const storyRef = doc(db, "stories", storyId);
    const snap = await getDoc(storyRef);

    if (!snap.exists()) {
      storyTitle.innerText = "Cerita tidak ditemukan";
      return;
    }

    const story = snap.data();

    storyTitle.innerText = story.title || "Tanpa Judul";
    storyAuthor.innerText = story.author || story.email || "Penulis";
    storyDescription.innerText =
      story.description || "Belum ada deskripsi cerita.";

    storyCover.src =
      story.cover || "https://via.placeholder.com/300x450?text=No+Cover";

    if (readCount) {
      readCount.innerText = story.views || 0;
    }

  } catch (err) {
    console.error(err);
    storyTitle.innerText = "Gagal memuat cerita";
  }
}

async function loadChapters() {
  try {
    const q = query(
      collection(db, "chapters"),
      where("storyId", "==", storyId),
      orderBy("chapterNumber", "asc")
    );

    const snapshot = await getDocs(q);

    chapters = [];

    snapshot.forEach((docItem) => {
      chapters.push({
        id: docItem.id,
        ...docItem.data()
      });
    });

    chapterCount.innerText = chapters.length;
    chapterList.innerHTML = "";

    if (chapters.length === 0) {
      chapterList.innerHTML = "<p>Belum ada chapter.</p>";
      startReadBtn.disabled = true;
      return;
    }

    startReadBtn.onclick = () => {
      window.location.href =
        `read.html?storyId=${storyId}&chapterId=${chapters[0].id}`;
    };

    chapters.forEach((chapter) => {
      chapterList.innerHTML += `
        <a class="chapter-item" href="read.html?storyId=${storyId}&chapterId=${chapter.id}">
          <div>
            <h3>Bagian ${chapter.chapterNumber}: ${chapter.title}</h3>
            <p>${chapter.content ? chapter.content.substring(0, 130) + "..." : ""}</p>
          </div>
          <span>›</span>
        </a>
      `;
    });

  } catch (err) {
    console.error(err);
    chapterList.innerHTML = "<p>Gagal memuat chapter.</p>";
  }
}

async function loadVotes() {
  try {
    const snapshot = await getDocs(
      collection(db, "stories", storyId, "votes")
    );

    voteCount.innerText = snapshot.size;
  } catch (err) {
    console.error(err);
  }
}

voteBtn.onclick = async () => {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const voteRef = doc(
    db,
    "stories",
    storyId,
    "votes",
    currentUser.uid
  );

  const voteSnap = await getDoc(voteRef);

  if (voteSnap.exists()) {
    await deleteDoc(voteRef);
  } else {
    await setDoc(voteRef, {
      uid: currentUser.uid,
      createdAt: Date.now()
    });
  }

  loadVotes();
};

libraryBtn.onclick = async () => {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  await setDoc(
    doc(db, "users", currentUser.uid, "library", storyId),
    {
      storyId: storyId,
      savedAt: Date.now()
    }
  );

  alert("Ditambahkan ke Library!");
};