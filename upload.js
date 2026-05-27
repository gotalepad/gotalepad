import { db, auth }
from "./js/firebase.js";

import {

    collection,
    addDoc,
    serverTimestamp

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ELEMENT

const uploadBtn =
document.getElementById("uploadBtn");


// UPLOAD STORY

if(uploadBtn){

    uploadBtn.onclick = async ()=>{

        const title =
        document.getElementById("storyTitle").value;

        const description =
        document.getElementById("storyDescription").value;


        // VALIDASI

        if(title === "" || description === ""){

            alert("Isi semua field!");

            return;

        }


        // USER LOGIN

        if(!auth.currentUser){

            alert("Harus login!");

            return;

        }


        // UPLOAD

        await addDoc(

            collection(db,"stories"),

            {

                title:title,

                description:description,

                author:auth.currentUser.email,

                views:0,

                createdAt:serverTimestamp()

            }

        );


        alert("Story berhasil upload!");


        // RESET INPUT

        document.getElementById("storyTitle").value = "";

        document.getElementById("storyDescription").value = "";

    };

}