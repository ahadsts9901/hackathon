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