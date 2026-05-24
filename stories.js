import { db }
from "./firebase.js";

import {

    collection,
    onSnapshot

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ELEMENT

const container =
document.getElementById("storyContainer");


// REALTIME STORIES

if(container){

    onSnapshot(

        collection(db,"stories"),

        (snapshot)=>{

            container.innerHTML = "";

            snapshot.forEach((doc)=>{

                const data =
                doc.data();

                container.innerHTML += `

                <div class="card">

                    <img
                    src="https://picsum.photos/200/300?random=${Math.random()}">

                    <h3>
                        ${data.title}
                    </h3>

                    <p>
                        ${data.author}
                    </p>

                    <span>
                        👁 ${data.views}
                    </span>

                </div>

                `;

            });

        }

    );

}