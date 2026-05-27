import { auth, db }
from "./js/firebase.js";

import {

  onAuthStateChanged,
  signOut

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

  collection,
  getDocs,
  query,
  orderBy,
  limit

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   ELEMENTS
========================= */

const trendingContainer =
document.getElementById(
"trendingStories"
);

const latestContainer =
document.getElementById(
"latestStories"
);

const recommendedContainer =
document.getElementById(
"recommendedStories"
);

const searchInput =
document.getElementById(
"searchInput"
);

const authArea =
document.getElementById(
"authArea"
);

let allStories = [];

/* =========================
   AUTH NAVBAR
========================= */

onAuthStateChanged(
auth,
(user)=>{

if(user){

authArea.innerHTML = `

<a href="./write.html"
class="wp-menu">

Tulis ▾

</a>

<a href="#"
class="premium-btn">

⚡ Premium

</a>

<div class="profile-dropdown">

<button
id="profileBtn"
class="avatar-btn">

<img
id="navAvatar"
src="https://i.pravatar.cc/150">

<span>
⌄
</span>

</button>

<div
id="profileMenu"
class="dropdown-menu">

<a href="./profile.html">

Profil Saya

</a>

<hr>

<a href="./library.html">

Perpustakaan

</a>

<a href="./write.html">

Tulis Cerita

</a>

<hr>

<a href="#">

Pengaturan

</a>

<a href="#"
id="logoutBtn">

Keluar

</a>

</div>

</div>

`;

const profileBtn =
document.getElementById(
"profileBtn"
);

const profileMenu =
document.getElementById(
"profileMenu"
);

const logoutBtn =
document.getElementById(
"logoutBtn"
);

/* DROPDOWN */

profileBtn.onclick = ()=>{

profileMenu.classList.toggle(
"show-dropdown"
);

};

/* CLOSE */

window.onclick = (e)=>{

if(

!e.target.closest(
".profile-dropdown"
)

){

profileMenu.classList.remove(
"show-dropdown"
);

}

};

/* LOGOUT */

logoutBtn.onclick =
async ()=>{

await signOut(auth);

window.location.reload();

};

}else{

authArea.innerHTML = `

<a href="./write.html"
class="wp-menu">

Tulis ▾

</a>

<a href="./login.html"
class="wp-menu">

Login

</a>

<a href="./register.html"
class="premium-btn">

Daftar

</a>

`;

}

});

/* =========================
   LOAD STORIES
========================= */

async function loadStories(){

try{

const q = query(

collection(db,"stories"),

orderBy(
"createdAt",
"desc"
),

limit(24)

);

const snapshot =
await getDocs(q);

allStories = [];

snapshot.forEach((docItem)=>{

allStories.push({

id:docItem.id,

...docItem.data()

});

});

/* RENDER */

renderStories(
trendingContainer,
allStories.slice(0,6)
);

renderStories(
latestContainer,
allStories.slice(6,12)
);

renderStories(
recommendedContainer,
allStories.slice(12,18)
);

}catch(err){

console.error(
"Gagal load stories:",
err
);

}

}

/* =========================
   RENDER STORIES
========================= */

function renderStories(
container,
stories
){

if(!container) return;

container.innerHTML = "";

/* EMPTY */

if(stories.length === 0){

container.innerHTML = `

<p class="empty-text">

Belum ada cerita.

</p>

`;

return;

}

/* CARD */

stories.forEach((story)=>{

container.innerHTML += `

<a
href="./story.html?id=${story.id}"
class="story-link">

<div class="wp-story-card">

<img
src="${
story.cover ||

'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600'
}"

alt="cover">

<div class="wp-story-info">

<h3>

${story.title || "Tanpa Judul"}

</h3>

<p>

${story.author || "Penulis"}

</p>

<div class="story-tags">

<span>

${story.category || "Novel"}

</span>

<span>

Gotalepad

</span>

</div>

<div class="story-meta">

<span>

👁 ${story.views || 0}

</span>

<span>

⭐ ${story.votes || 0}

</span>

</div>

</div>

</div>

</a>

`;

});

}

/* =========================
   SEARCH
========================= */

if(searchInput){

searchInput.addEventListener(
"input",
()=>{

const keyword =
searchInput.value
.toLowerCase();

/* RESET */

if(keyword === ""){

renderStories(
trendingContainer,
allStories.slice(0,6)
);

renderStories(
latestContainer,
allStories.slice(6,12)
);

renderStories(
recommendedContainer,
allStories.slice(12,18)
);

return;

}

/* FILTER */

const filtered =
allStories.filter((story)=>{

return(

(story.title || "")
.toLowerCase()
.includes(keyword)

||

(story.author || "")
.toLowerCase()
.includes(keyword)

||

(story.category || "")
.toLowerCase()
.includes(keyword)

);

});

/* SHOW */

renderStories(
trendingContainer,
filtered
);

latestContainer.innerHTML = "";

recommendedContainer.innerHTML = "";

});

}

/* =========================
   AUTO SLIDER
========================= */

const heroTexts = [

{

title:
"Lebih banyak kategori,<br>lebih mudah eksis",

desc:
"Tambahkan genre, subgenre, dan fandom ke ceritamu"

},

{

title:
"Bangun komunitas pembacamu",

desc:
"Temukan jutaan pembaca seperti Wattpad"

},

{

title:
"Tulis novelmu sekarang",

desc:
"Mulai perjalanan menjadi penulis terkenal"

}

];

let currentSlide = 0;

const heroTitle =
document.querySelector(
".hero-text h1"
);

const heroDesc =
document.querySelector(
".hero-text p"
);

function changeHero(){

if(!heroTitle || !heroDesc)
return;

currentSlide++;

if(
currentSlide >=
heroTexts.length
){

currentSlide = 0;

}

heroTitle.innerHTML =
heroTexts[currentSlide].title;

heroDesc.innerHTML =
heroTexts[currentSlide].desc;

}

setInterval(
changeHero,
5000
);

/* =========================
   START
========================= */

loadStories();