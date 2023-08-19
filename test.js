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