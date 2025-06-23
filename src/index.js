const baseURL = 'http://localhost:3000/posts';
const postList = document.querySelector('#post-list');
const postDetail = document.querySelector('#post-detail');
const newPostForm = document.querySelector('#new-post-form');
const editForm = document.querySelector('#edit-post-form');
let currentPostId = null;

function displayPosts() {
  fetch(baseURL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = '';
      posts.forEach(post => renderPostItem(post));

      if (posts.length > 0) {
        handlePostClick(posts[0].id); // Show first post by default
      }
    });
}

function renderPostItem(post) {
  const div = document.createElement('div');
  div.textContent = post.title;
  div.classList.add('post-title');
  div.addEventListener('click', () => handlePostClick(post.id));
  postList.appendChild(div);
}

function handlePostClick(id) {
  fetch(`${baseURL}/${id}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.image}" alt="${post.title}" width="200">
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.querySelector('#edit-btn').addEventListener('click', () => showEditForm(post));
      document.querySelector('#delete-btn').addEventListener('click', () => deletePost(post.id));
    });
}

function addNewPostListener() {
  newPostForm.addEventListener('submit', e => {
    e.preventDefault();
    const newPost = {
      title: e.target.title.value,
      author: e.target.author.value,
      content: e.target.content.value,
      image: e.target.image.value
    };

    fetch(baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(post => {
        renderPostItem(post);
        newPostForm.reset();
      });
  });
}

function showEditForm(post) {
  editForm.classList.remove('hidden');
  editForm.title.value = post.title;
  editForm.content.value = post.content;

  editForm.onsubmit = e => {
    e.preventDefault();
    const updatedPost = {
      title: editForm.title.value,
      content: editForm.content.value
    };

    fetch(`${baseURL}/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(updated => {
        displayPosts();
        handlePostClick(updated.id);
        editForm.classList.add('hidden');
      });
  };

  document.querySelector('#cancel-edit').onclick = () => {
    editForm.classList.add('hidden');
  };
}

function deletePost(id) {
  fetch(`${baseURL}/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      displayPosts();
      postDetail.innerHTML = '<p>Select a post to view details</p>';
    });
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);
