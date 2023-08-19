const firebaseConfig = {
    apiKey: "AIzaSyCmKb5TcZ1TLrH3NbC3ADHHgQG6u9TXwVc",
    authDomain: "practice-4cdb5.firebaseapp.com",
    projectId: "practice-4cdb5",
    storageBucket: "practice-4cdb5.appspot.com",
    messagingSenderId: "566308702301",
    appId: "1:566308702301:web:f8ed2b146cc7e5faffe5b4",
    measurementId: "G-W7ERKEX4FB"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function textAreaSize() {
    var textArea = document.querySelector(".post");
    textArea.style.height = "auto"; // Reset the height to auto to recalculate the size

    // Calculate the maximum height for 5 lines
    var maxHeight = parseInt(window.getComputedStyle(textArea).lineHeight) * 16;

    // Set the height to the scrollHeight, but not exceeding the maximum height
    textArea.style.height = Math.min(textArea.scrollHeight, maxHeight) + "px";
}

function createPost(event) {
    event.preventDefault();

    // get the values
    let title = document.getElementById("title");
    let post = document.getElementById("post");
    let auth = firebase.auth();
    let user = auth.currentUser;
    let userEmail = user.email;

    // Get the current timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    db.collection("posts")
        .add({
            title:title.value,
            post: post.value,
            user: userEmail,
            timestamp: timestamp,
        })
        .then((docRef) => {
            //console.log("Document written with ID:", docRef.id);
            Swal.fire({
                icon: "success",
                title: "Added",
                text: "Post Done",
                confirmButtonColor: "#212121",
            });
            window.location.href = "./index.html";
            renderPosts();
        })
        .catch((error) => {
            //console.error("Error adding document:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Could Not Post",
                confirmButtonColor: "#212121",
            });
        });

    post.value = "";
}

function renderPosts() {
    let container = document.querySelector(".result");
    container.innerHTML = "";
    db.collection("post")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                container.innerText = "No Post Found";
            } else {
                querySnapshot.forEach(function(doc) {
                    var data = doc.data();
                    var timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
                    let post = document.createElement("div");
                    post.className += " column renderPost";

                    let row = document.createElement("div");
                    row.className += "row";
                    post.appendChild(row);

                    let image = document.createElement("h2");
                    image.className += " bi bi-person-fill";
                    row.appendChild(image);

                    let drop = document.createElement("div");
                    drop.innerHTML = `
                      <div class="dropdown">
                        <button class="drop-down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <h2 class="bi bi-three-dots-vertical dots"></h2>
                        </button>
                        <ul class="dropdown-menu">
                          <li class="list dropdown-options" type="buttons" onclick="deletePost('${doc.id}')"><i class="bi bi-trash-fill"></i> Delete Post</li>
                          <li class="list dropdown-options" type="buttons" onclick="editPost('${doc.id}')"><i class="bi bi-pencil-fill"></i> Edit Post</li>
                        </ul>
                      </div>`;
                    row.appendChild(drop);

                    let name = document.createElement("p");
                    name.innerText = data.user.slice(0, -10);
                    row.appendChild(name);

                    let time = document.createElement("p");
                    time.className += " postTime";
                    time.innerText = moment(timestamp).fromNow();
                    row.appendChild(time);

                    let text = document.createElement("p");
                    text.className += " text";
                    text.innerText = data.post;
                    post.appendChild(text);

                    let commentRow = document.createElement("div");
                    commentRow.innerHTML = `
                    <div class="dropdown hundred">
                    <button class="drop-down comment-flex" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <p class="bi bi-star" id="like" onclick="like(event)"> Like</p>
                      <p class="bi bi-chat-square-text dots hundred"> Comments</p>
                    </button>
                    <ul class="dropdown-menu commentCont">
                    <form class="commentform row" onsubmit="addComment(event,'${doc.id}')">
                    <textarea rows="3" required class="commentinput" placeholder="Enter your comment..." ></textarea>
                    <button type="submit" class="commentsubmit">+ Add</button>
                    </form>
                    </ul>
                  </div>
                    `;
                    post.appendChild(commentRow);

                    // Render comments
                    let commentsDiv = document.createElement("div");
                    commentsDiv.className = "commentsDiv";

                    db.collection("post")
                        .doc(doc.id)
                        .collection("comments")
                        .orderBy("timestamp", "desc")
                        .get()
                        .then((querySnapshot) => {
                            if (!querySnapshot.empty) {
                                querySnapshot.forEach((commentDoc) => {
                                    let commentData = commentDoc.data();
                                    let commentUser = commentData.user;
                                    let commentText = commentData.comment;

                                    let commentRow = document.createElement("div");
                                    commentRow.className = "commentRow";
                                    commentRow.innerHTML = `<p><p class="dropdown-options commentEditDel" onclick="editComment('${doc.id}', '${commentDoc.id}')"><i class="bi bi-pencil-fill"></i></p>
                                    <p class="dropdown-options commentEditDel" onclick="deleteComment('${doc.id}', '${commentDoc.id}')"><i class="bi bi-trash-fill"></i></p><strong>${commentUser.slice(0, -10)}:</strong> ${commentText}</p>`;
                                    commentsDiv.appendChild(commentRow);
                                });
                            }
                        })
                        .catch((error) => {
                            //console.error("Error getting comments:", error);
                        });

                    var ul = commentRow.querySelector(".commentCont"); // Update this line
                    var li = document.createElement("li"); // Update this line
                    li.appendChild(commentsDiv);
                    ul.appendChild(li);

                    container.appendChild(post);
                });
            }
        })
        .catch((error) => {
            //console.error("Error getting posts: ", error);
        });
}

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

firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
        window.location.href = "./login/index.html"
        console.log("not signed in");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    renderPosts();
});