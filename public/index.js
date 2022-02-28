/**
 * Name: Tara Wueger
 * Date: 05/21/2020
 * Section AJ: Wilson Tang and Wenxuan Liu
 *
 * This is the index.js page for my fourth creative project (index.html). It allows users to post
 * discussion posts and comments to the Discussion Board API.
 */
"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * Fetches posts and comments already existing in the server and displays them on the page. Sets
   * up the submit button for creating a new post.
   */
  function init() {
    fetchAuthors();
    fetchPosts();
    id("post-form").addEventListener("submit", addNewPost);
  }

  /**
   * Fetches all posts from the Discussion Board API and displays them on the page.
   */
  function fetchAuthors() {
    fetch("/authors")
      .then(checkStatus)
      .then(resp => resp.text())
      .then(showAuthors)
      .catch(handleError);
  }

  /**
   * Displays all pre-existing authors recieved from the Discussion Board API on the page, adding
   * them to the index.html DOM.
   * @param {Object} text - text file of all author's names, each on a separate line
   */
  function showAuthors(text) {
    let authors = text.split("\n");
    for (let i = 0; i < authors.length; i++) {
      let name = gen("li");
      name.textContent = authors[i];
      qs("#authors ul").appendChild(name);
    }
  }

  /**
   * Fetches all posts from the Discussion Board API and displays them on the page.
   */
  function fetchPosts() {
    fetch("/posts")
      .then(checkStatus)
      .then(resp => resp.json())
      .then(showPosts)
      .catch(handleError);
  }

  /**
   * Displays all pre-existing posts recieved from the Discussion Board API on the page.
   * @param {Object} posts - all posts objects
   */
  function showPosts(posts) {
    let postIDs = Object.keys(posts);
    for (let i = 0; i < postIDs.length; i++) {
      addPost(posts[i]);
    }
  }

  /**
   * Adds a given post to the index.html DOM, displaying the post and its comments on the page, with
   * the most recent post at the top.
   * @param {Object} post - a single post object
   */
  function addPost(post) {
    let postID = post.postID;
    let newPost = gen("section");
    newPost.id = "post" + postID;
    newPost.classList.add("post");
    addPushpin(newPost);
    id("posts").insertBefore(newPost, id("posts").children[2]);
    let dateAuthor = gen("div");
    newPost.appendChild(dateAuthor);
    let dateTime = post.dateTime;
    let addDateTime = gen("p");
    addDateTime.textContent = dateTime;
    dateAuthor.appendChild(addDateTime);
    let author = post.author;
    let addAuthor = gen("p");
    addAuthor.textContent = author;
    dateAuthor.appendChild(addAuthor);
    let title = post.title;
    if (title) {
      let addTitle = gen("h3");
      addTitle.textContent = title;
      newPost.appendChild(addTitle);
    }
    let entry = post.entry;
    let addEntry = gen("p");
    addEntry.textContent = entry;
    newPost.appendChild(addEntry);
    showComments(post);
  }

  /**
   * Adds a pushpin image to the given post.
   * @param {Object} post - a single post object
   */
  function addPushpin(post) {
    let pushpinDiv = gen("div");
    pushpinDiv.classList.add("pushpin");
    post.appendChild(pushpinDiv);
    let pushpin = gen("img");
    pushpin.src = "pushpin.png";
    pushpin.alt = "pushpin";
    pushpinDiv.appendChild(pushpin);
  }

  /**
   * Displays all comments and the form to submit new comments from a single post.
   * @param {Object} post - a single post object
   */
  function showComments(post) {
    let postID = post.postID;
    let comments = post.comments;
    let commentIDs = Object.keys(comments);
    let commentsContainer = gen("section");
    commentsContainer.classList.add("comments");
    let header = gen("h4");
    header.textContent = "Comments";
    commentsContainer.appendChild(header);
    qs("#post" + postID).appendChild(commentsContainer);
    addPostComment(postID, commentIDs.length);
    for (let i = 0; i < commentIDs.length; i++) {
      addComment(comments[i], i);
    }
  }

  /**
   * Adds the given comment to the index.html DOM, displaying it on the page with the most recent
   * comment at the top.
   * @param {Object} comment - a single comment object
   * @param {number} commentID - id associated with the comment (starts at 0, incrementing by 1
   *                             for each comment in a post)
   */
  function addComment(comment, commentID) {
    let postID = comment.postID;
    let newComment = gen("section");
    newComment.id = "post" + postID + "comment" + commentID;
    if (commentID === 0) {
      qs("#post" + postID + " section").appendChild(newComment);
    } else {
      qs("#post" + postID + " section")
        .insertBefore(newComment, qs("#post" + postID + " section").children[2]);
    }
    let addDateTime = gen("p");
    addDateTime.textContent = comment.dateTime;
    newComment.appendChild(addDateTime);
    let insertComment = gen("p");
    insertComment.textContent = comment.comment;
    newComment.appendChild(insertComment);
  }

  /**
   * Adds the form for users to submit new comments to the index.html DOM for a single post. The
   * form is displayed above all of the comments.
   * @param {number} postID - unique id associated with a post (starts at 0, incrementing by 1
   *                          for each post)
   * @param {number} commentID - id associated with the comment (starts at 0, incrementing by 1
   *                             for each comment in a post)
   */
  function addPostComment(postID, commentID) {
    let commentsForm = gen("form");
    commentsForm.class = "comment-form";
    if (commentID === 0) {
      qs("#post" + postID + " .comments").appendChild(commentsForm);
    } else {
      qs("#post" + postID + " .comments")
        .insertBefore(commentsForm, qs("#post" + postID + " .comments").children[1]);
    }
    let label = gen("label");
    label.htmlFor = "comment";
    label.textContent = "New Comment: ";
    commentsForm.appendChild(label);
    let input = gen("input");
    input.type = "text";
    input.name = "comment";
    input.required = "required";
    commentsForm.appendChild(input);
    let hiddenPostID = gen("input");
    hiddenPostID.type = "text";
    hiddenPostID.name = "postID";
    hiddenPostID.value = postID;
    hiddenPostID.classList.add("hidden");
    commentsForm.appendChild(hiddenPostID);
    let button = gen("button");
    button.class = "submit-comment";
    button.textContent = "Post Comment";
    commentsForm.appendChild(button);
    commentsForm.addEventListener("submit", addNewComment);
  }

  /**
   * Gathers the user's input from the create comment form, sending it to the server to be added.
   * Also clears the comment input form after gathering the input parameters and adds the new
   * comments to the post.
   * @param {Object} event description
   */
  function addNewComment(event) {
    if (!id("error").classList.contains("hidden")) {
      id("error").classList.add("hidden");
    }
    event.preventDefault();
    let params = new FormData(this);
    this.children[1].value = "";
    fetch("/addComment", {method: "POST", body: params})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(comment => addComment(comment, Object.keys(comment).length))
      .catch(handleError);
  }

  /**
   * Gathers the user's input from the create post form, sending it to the server to be added.
   * Also lears the input forms after gathering the input parameters and adds the new post to the
   * page.
   * @param {Object} event description
   */
  function addNewPost(event) {
    if (!id("error").classList.contains("hidden")) {
      id("error").classList.add("hidden");
    }
    event.preventDefault();
    let form = id("post-form");
    let params = new FormData(form);
    form.children[3].value = "";
    form.children[6].value = "";
    form.children[10].value = "";
    fetch("/addPost", {method: "POST", body: params})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(addPost)
      .catch(handleError);
  }

  /**
   * Handles errors thrown by the Discussion Board API when fetch fails.
   */
  function handleError() {
    id("error").classList.remove("hidden");
  }

  /** ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    }
    throw Error("Error in request: " + response.statusText);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();