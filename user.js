const firebaseConfig = {
    apiKey: "AIzaSyCmKb5TcZ1TLrH3NbC3ADHHgQG6u9TXwVc",
    authDomain: "practice-4cdb5.firebaseapp.com",
    projectId: "practice-4cdb5",
    storageBucket: "practice-4cdb5.appspot.com",
    messagingSenderId: "566308702301",
    appId: "1:566308702301:web:f8ed2b146cc7e5faffe5b4",
    measurementId: "G-W7ERKEX4FB"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

let username = "";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        username = user.email.slice(0, -10); // Store the username
        document.getElementById("mail").innerText = user.email;
        document.getElementById("pname").innerText = username;
        document.getElementById("User").innerText = username;
    } else {
        window.location.href = "../login/index.html";
        document.getElementById("headerName").innerText = 'null';
    }
});



function renderUserPosts(userEmail) {
    let container = document.querySelector(".user-posts-container");
    container.innerHTML = "";
    db.collection("posts")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.empty) {
            container.innerHTML = "<h1 class='font'>No Posts Found</h1>";
            console.log("me")
        } else {
            
                querySnapshot.forEach(function (doc) {
                    var data = doc.data();

                    var timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
                    let post = document.createElement("div");
                    post.className += " column renderPost";

                    let row = document.createElement("div");
                    row.className += " row";
                    post.appendChild(row);

                    let image = document.createElement("img");
                    image.className += "userImg"
                    image.src = "https://avatars.githubusercontent.com/u/120649081?v=4"
                    row.appendChild(image);

                    let div = document.createElement("div")
                    div.className += " col"
                    div.style.marginLeft = "1em"
                    row.appendChild(div);

                    let title = document.createElement("p");
                    title.className += " title";
                    title.style.fontSize = "1.5em";
                    title.style.fontWeight = "bold";
                    title.innerText = data.title; // Render the title
                    div.appendChild(title);

                    let text = document.createElement("p");
                    text.className += " text";
                    text.style.fontSize = "1em"
                    text.style.fontWeight = "bolder"
                    text.innerText = data.post;
                    post.appendChild(text);

                    let tim = document.createElement("div")
                    tim.className += " row gap"
                    div.appendChild(tim)

                    let name = document.createElement("p");
                    name.innerText = `${data.user.slice(0, -10)}`;
                    tim.appendChild(name);

                    let time = document.createElement("p");
                    time.className += " postTime";
                    time.innerText = ` ${moment(timestamp).fromNow()}`;
                    tim.appendChild(time);

                    let cont = document.createElement("div");
                    cont.className += " row";
                    cont.style.gap = "1em"
                    cont.style.padding = "0.5em"

                        let del = document.createElement('p')
                        del.className += 'del'
                        del.innerText = 'Delete'
                        del.addEventListener("click", function () {
                            post.dataset.id = doc.id;
                            console.log(doc.id);
                            delPost(doc.id);
                        });
                        cont.appendChild(del)

                        let edit = document.createElement('p')
                        edit.className += 'del'
                        edit.innerText = 'Edit'
                        edit.addEventListener("click", function () {
                            post.dataset.id = doc.id;
                            console.log(doc.id);
                            editPost(doc.id, data.title, data.post);
                        });
                        cont.appendChild(edit)
                        
                        post.appendChild(cont);

                        console.log(data.user == localStorage.getItem('userMail'))
                        
                        if (data.user == localStorage.getItem('userMail')) {
                            console.log("Matched user:", data.user);
                            console.log(post)
                            container.appendChild(post);
                        }else{
                            console.log("Not matched user:", data.user);
                        }
                });
            }
        })
        .catch((error) => {
            console.error("Error getting user's posts:", error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    renderUserPosts();
});

function logOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("Sign out successful");
            // Redirect to the sign-in page or any other desired destination
            window.location.href = "./login/index.html";
        })
        .catch((error) => {
            console.log("Sign out error:", error);
        });
}