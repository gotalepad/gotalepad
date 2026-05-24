import { auth, db }
from './firebase.js';

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const container =
document.getElementById("storyContainer");

const navbar =
document.getElementById("navbarMenu");

let allStories = [];



/* =========================
   NAVBAR LOGIN SYSTEM
========================= */

onAuthStateChanged(auth,
async(user)=>{

if(user){

const userDoc =
await getDoc(
doc(db,"users",user.uid)
);

const userData =
userDoc.data();

navbar.innerHTML = `

<a href="index.html">
Home
</a>

<a href="write.html">
Tulis
</a>

<a href="library.html">
Library
</a>

<a href="profile.html">
${userData.username}
</a>

<a href="#" id="logoutBtn">
Logout
</a>

`;

document
.getElementById("logoutBtn")
.onclick = async ()=>{

await auth.signOut();

window.location.reload();

};

}else{

navbar.innerHTML = `

<a href="index.html">
Home
</a>

<a href="login.html">
Login
</a>

`;

}

});



/* =========================
   RENDER STORIES
========================= */

function renderStories(stories){

container.innerHTML = "";

if(stories.length === 0){

container.innerHTML = `
<p class="empty-text">
Novel tidak ditemukan
</p>
`;

return;

}

stories.forEach((story)=>{

container.innerHTML += `

<a href="story.html?id=${story.id}"
class="story-link">

<div class="story-card">

<img src="${story.cover}">

<div class="story-info">

<h3>${story.title}</h3>

<p>${story.author}</p>

</div>

</div>

</a>

`;

});

}



/* =========================
   LOAD STORIES FIREBASE
========================= */

async function loadStories(){

const querySnapshot =
await getDocs(
collection(db,"stories")
);

allStories = [];

querySnapshot.forEach((docItem)=>{

const data = docItem.data();

allStories.push({
id:docItem.id,
...data
});

});

renderStories(allStories);

}



/* =========================
   SEARCH SYSTEM
========================= */

document
.getElementById("searchInput")
.addEventListener("input",(e)=>{

const keyword =
e.target.value.toLowerCase();

const filtered =
allStories.filter((story)=>{

return story.title
.toLowerCase()
.includes(keyword);

});

renderStories(filtered);

});



/* =========================
   START WEBSITE
========================= */

loadStories();