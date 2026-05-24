import { auth }
from "./firebase.js";

import {

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ELEMENT

const registerBtn =
document.getElementById("registerBtn");

const loginBtn =
document.getElementById("loginBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const homepage =
document.getElementById("homepage");

const registerBox =
document.getElementById("registerBox");

const loginBox =
document.getElementById("loginBox");

const userEmail =
document.getElementById("userEmail");


// REGISTER

if(registerBtn){

    registerBtn.onclick = ()=>{

        const email =
        document.getElementById("registerEmail").value;

        const password =
        document.getElementById("registerPassword").value;


        createUserWithEmailAndPassword(
            auth,
            email,
            password
        )

        .then(()=>{

            alert("Register berhasil!");

        })

        .catch((error)=>{

            alert(error.message);

        });

    };

}


// LOGIN

if(loginBtn){

    loginBtn.onclick = ()=>{

        const email =
        document.getElementById("loginEmail").value;

        const password =
        document.getElementById("loginPassword").value;


        signInWithEmailAndPassword(
            auth,
            email,
            password
        )

        .then(()=>{

            alert("Login berhasil!");

        })

        .catch((error)=>{

            alert(error.message);

        });

    };

}


// LOGOUT

if(logoutBtn){

    logoutBtn.onclick = ()=>{

        signOut(auth);

    };

}


// AUTH STATE

onAuthStateChanged(auth,(user)=>{

    if(user){

        if(homepage){

            homepage.style.display =
            "block";

        }

        if(registerBox){

            registerBox.style.display =
            "none";

        }

        if(loginBox){

            loginBox.style.display =
            "none";

        }

        if(userEmail){

            userEmail.innerHTML =
            user.email;

        }

    }

    else{

        if(homepage){

            homepage.style.display =
            "none";

        }

        if(registerBox){

            registerBox.style.display =
            "flex";

        }

        if(loginBox){

            loginBox.style.display =
            "flex";

        }

    }

});