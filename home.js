import { auth, db }
from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const profileMenu =
document.getElementById(
"profileMenu"
);

const profileBtn =
document.getElementById(
"profileBtn"
);

const logoutBtn =
document.getElementById(
"logoutBtn"
);

const navAvatar =
document.getElementById(
"navAvatar"
);

let allStories = [];

/* =========================
   AUTH
========================= */

onAuthStateChanged(auth,
(user)=>{

if(user){

if(logoutBtn){

logoutBtn.onclick =
async ()=>{

await signOut(auth);

window.location.reload();

};

}

}else{

if(profileMenu){

profileMenu.innerHTML = `

<a href="login.html">
Login
</a>

<a href="register.html">
Daftar
</a>

`;

}

}

});

/* =========================
   DROPDOWN
========================= */

if(profileBtn){

profileBtn.onclick = ()=>{

profileMenu.classList.toggle(
"show-dropdown"
);

};

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

}

/* =========================
   LOAD STORIES
========================= */

async function loadStories(){

try{

const q =
query(
collection(db,"stories"),
orderBy(
"createdAt",
"desc"
),
limit(20)
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

/* =========================
   RENDER
========================= */

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

console.error(err);

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

if(stories.length === 0){

container.innerHTML = `

<p class="empty-text">
Belum ada cerita.
</p>

`;

return;

}

stories.forEach((story)=>{

container.innerHTML += `

<a
href="story.html?id=${story.id}"
class="story-link">

<div class="wp-story-card">

<img
src="${
story.cover ||
'https://via.placeholder.com/300x450?text=No+Cover'
}">

<div class="wp-story-info">

<h3>
${story.title}
</h3>

<p>
${story.author || story.email}
</p>

<div class="story-tags">

<span>
${story.category || "Romance"}
</span>

<span>
Novel
</span>

</div>

<div class="story-meta">

<span>
👁 0
</span>

<span>
⭐ 0
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

const filtered =
allStories.filter((story)=>{

return(

story.title
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

renderStories(
trendingContainer,
filtered
);

latestContainer.innerHTML = "";
recommendedContainer.innerHTML = "";

});

}

/* =========================
   START
========================= */

loadStories();