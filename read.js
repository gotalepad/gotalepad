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
  deleteDoc,
  addDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const params = new URLSearchParams(window.location.search);

const storyId =
  params.get("storyId") || params.get("id");

const chapterId =
  params.get("chapterId") || params.get("chapter");

const storyTitle = document.getElementById("storyTitle");
const storyAuthor = document.getElementById("storyAuthor");
const chapterTitle = document.getElementById("chapterTitle");
const chapterContent = document.getElementById("chapterContent");

const backToStory = document.getElementById("backToStory");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const voteBtn = document.getElementById("voteBtn");
const voteCount = document.getElementById("voteCount");

const commentInput = document.getElementById("commentInput");
const sendCommentBtn = document.getElementById("sendCommentBtn");
const commentList = document.getElementById("commentList");

const fontPlus = document.getElementById("fontPlus");
const fontMinus = document.getElementById("fontMinus");
const darkToggle = document.getElementById("darkToggle");

let currentUser = null;
let chapters = [];
let currentIndex = -1;
let fontSize = 21;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

if (!storyId || !chapterId) {
  chapterTitle.innerText = "Chapter tidak ditemukan";
  chapterContent.innerText = "URL chapter tidak valid.";
} else {
  backToStory.href = `story.html?id=${storyId}`;

  loadReader();
  loadVotes();
  loadComments();
}

async function loadReader() {
  try {
    const storySnap = await getDoc(
      doc(db, "stories", storyId)
    );

    if (!storySnap.exists()) {
      chapterTitle.innerText = "Cerita tidak ditemukan";
      chapterContent.innerText = "";
      return;
    }

    const story = storySnap.data();

    storyTitle.innerText = story.title || "Tanpa Judul";
    storyAuthor.innerText =
      story.author || story.email || "Penulis Gotalepad";

    await updateDoc(
      doc(db, "stories", storyId),
      {
        views: increment(1)
      }
    );

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

    currentIndex =
      chapters.findIndex(
        chapter => chapter.id === chapterId
      );

    if (currentIndex === -1) {
      chapterTitle.innerText = "Chapter tidak ditemukan";
      chapterContent.innerText = "";
      return;
    }

    renderChapter(chapters[currentIndex]);
    updateNavigation();

  } catch (err) {
    console.error(err);

    chapterTitle.innerText = "Gagal memuat chapter";
    chapterContent.innerText = err.message;
  }
}

function renderChapter(chapter) {
  chapterTitle.innerText =
    chapter.title || "Tanpa Judul";

  chapterContent.innerHTML = "";

  const paragraphs =
    (chapter.content || "")
    .split("\n")
    .filter(line => line.trim() !== "");

  if (paragraphs.length === 0) {
    chapterContent.innerHTML =
      "<p>Belum ada isi chapter.</p>";
    return;
  }

  paragraphs.forEach((line) => {
    const p = document.createElement("p");
    p.innerText = line;
    chapterContent.appendChild(p);
  });
}

function updateNavigation() {
  prevBtn.disabled = currentIndex <= 0;
  nextBtn.disabled =
    currentIndex >= chapters.length - 1;

  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      const prev = chapters[currentIndex - 1];

      window.location.href =
        `read.html?storyId=${storyId}&chapterId=${prev.id}`;
    }
  };

  nextBtn.onclick = () => {
    if (currentIndex < chapters.length - 1) {
      const next = chapters[currentIndex + 1];

      window.location.href =
        `read.html?storyId=${storyId}&chapterId=${next.id}`;
    }
  };
}

async function loadVotes() {
  try {
    const snapshot = await getDocs(
      collection(db, "chapters", chapterId, "votes")
    );

    voteCount.innerText =
      snapshot.size + " vote";

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
    "chapters",
    chapterId,
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

sendCommentBtn.onclick = async () => {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const text = commentInput.value.trim();

  if (!text) return;

  await addDoc(
    collection(db, "chapters", chapterId, "comments"),
    {
      uid: currentUser.uid,
      email: currentUser.email,
      comment: text,
      createdAt: Date.now()
    }
  );

  commentInput.value = "";
  loadComments();
};

async function loadComments() {
  try {
    const q = query(
      collection(db, "chapters", chapterId, "comments"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    commentList.innerHTML = "";

    if (snapshot.empty) {
      commentList.innerHTML =
        "<p>Belum ada komentar.</p>";
      return;
    }

    snapshot.forEach((docItem) => {
      const data = docItem.data();

      commentList.innerHTML += `
        <div class="comment-card">
          <strong>${data.email || "Pembaca"}</strong>
          <p>${data.comment}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    commentList.innerHTML =
      "<p>Gagal memuat komentar.</p>";
  }
}

fontPlus.onclick = () => {
  fontSize += 2;
  chapterContent.style.fontSize = fontSize + "px";
};

fontMinus.onclick = () => {
  if (fontSize > 15) {
    fontSize -= 2;
    chapterContent.style.fontSize = fontSize + "px";
  }
};

darkToggle.onclick = () => {
  document.body.classList.toggle("reader-dark");
};