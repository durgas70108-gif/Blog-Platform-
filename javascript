let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentUser = localStorage.getItem("currentUser") || null;

function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("posts", JSON.stringify(posts));
}

function register() {
    const username = document.getElementById("username").value;

    if (!username) {
        alert("Enter username");
        return;
    }

    if (users.includes(username)) {
        alert("User already exists");
        return;
    }

    users.push(username);
    saveData();

    alert("Registration successful");
}

function login() {
    const username = document.getElementById("username").value;

    if (!users.includes(username)) {
        alert("User not found");
        return;
    }

    currentUser = username;
    localStorage.setItem("currentUser", username);

    updateUI();
}

function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateUI();
}

function updateUI() {
    if (currentUser) {
        document.getElementById("authSection").style.display = "none";
        document.getElementById("userSection").style.display = "block";
        document.getElementById("currentUser").textContent = currentUser;
    } else {
        document.getElementById("authSection").style.display = "block";
        document.getElementById("userSection").style.display = "none";
    }

    renderPosts();
}

function createPost() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;

    if (!title || !content) {
        alert("Fill all fields");
        return;
    }

    const post = {
        id: Date.now(),
        title,
        content,
        author: currentUser,
        comments: []
    };

    posts.unshift(post);
    saveData();

    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";

    renderPosts();
}

function deletePost(id) {
    posts = posts.filter(post => post.id !== id);

    saveData();
    renderPosts();
}

function editPost(id) {
    const post = posts.find(p => p.id === id);

    const newTitle = prompt("Edit title", post.title);
    const newContent = prompt("Edit content", post.content);

    if (newTitle && newContent) {
        post.title = newTitle;
        post.content = newContent;

        saveData();
        renderPosts();
    }
}

function addComment(postId) {
    const input = document.getElementById(`comment-${postId}`);
    const text = input.value;

    if (!text) return;

    const post = posts.find(p => p.id === postId);

    post.comments.push({
        user: currentUser,
        text
    });

    saveData();
    renderPosts();
}

function renderPosts() {
    const container = document.getElementById("postsContainer");

    container.innerHTML = "";

    posts.forEach(post => {
        const div = document.createElement("div");
        div.classList.add("post");

        let commentsHTML = "";

        post.comments.forEach(comment => {
            commentsHTML += `
                <div class="comment">
                    <strong>${comment.user}</strong>: ${comment.text}
                </div>
            `;
        });

        div.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <small>By ${post.author}</small>

            ${
                currentUser === post.author
                ? `
                <br><br>
                <button onclick="editPost(${post.id})">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
                `
                : ""
            }

            <div class="comments">
                <h4>Comments</h4>
                ${commentsHTML}

                ${
                    currentUser
                    ? `
                    <div class="comment-input">
                        <input type="text" id="comment-${post.id}" placeholder="Write a comment">
                        <button onclick="addComment(${post.id})">Post</button>
                    </div>
                    `
                    : ""
                }
            </div>
        `;

        container.appendChild(div);
    });
}

updateUI();
