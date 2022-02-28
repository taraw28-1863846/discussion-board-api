/**
 * Name: Tara Wueger
 * Date: 05/21/2020
 * Section AJ: Wilson Tang and Wenxuan Liu
 *
 * This is the app.js file for my fourth creative project (index.html). This API listens for
 * requests in order to provide various information about the posts in the discussion board. This
 * includes the date/time a post was posted, a post's title and author (if available), the post
 * entry text content, and any comments that the post has.
 */
'use strict';

const CLIENT_ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;
const MAX_HOUR = 12;
const MILITARY_MAX_HOUR = 24;
const TEN = 10;
const PORT_NUM = 8000;

const express = require("express");
const app = express();

const fs = require("fs").promises;
const multer = require("multer");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

/**
 * Reads and sends all posts from the posts.json file.
 */
app.get("/posts", async (req, res) => {
  try {
    let posts = await fs.readFile("posts.json", "utf8");
    res.type("json").send(posts);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(SERVER_ERROR_CODE).send("File doesn't exist.");
    } else {
      res.status(SERVER_ERROR_CODE).send("Something went wrong on the server.");
    }
  }
});

/**
 * Reads and sends all of the authors from the authors.txt file.
 */
app.get("/authors", async (req, res) => {
  try {
    let authors = await fs.readFile("authors.txt", "utf8");
    res.type("text").send(authors);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(SERVER_ERROR_CODE).send("File doesn't exist.");
    } else {
      res.status(SERVER_ERROR_CODE).send("Something went wrong on the server.");
    }
  }
});

/**
 * Gets parameters from POST request and creates a new post object which is sent to the client.
 * Handles server and client errors, sending appropriate error messages for each error code.
 */
app.post("/addPost", async (req, res) => {
  res.type("text");
  let title = req.body.title;
  let author = req.body.author;
  let entry = req.body.entry;
  let dateTime = getDateTime();
  if (entry) {
    try {
      let posts = await fs.readFile("posts.json", "utf8");
      posts = JSON.parse(posts);
      let numPosts = Object.keys(posts).length;
      posts[numPosts] = createPost(numPosts, dateTime, author, title, entry);
      await fs.writeFile("posts.json", JSON.stringify(posts));
      res.type("json").send(posts[numPosts]);
    } catch (err) {
      if (err.code === "ENOENT") {
        res.status(SERVER_ERROR_CODE).send("File doesn't exist.");
      } else {
        res.status(SERVER_ERROR_CODE).send("Something went wrong on the server.");
      }
    }
  } else {
    res.status(CLIENT_ERROR_CODE).send("Missing POST parameter: entry.");
  }
});

/**
 * Takes all of the given parameters and creates a post object, which is returned.
 * @param {number} postID - unique id associated with a post (starts at 0, incrementing by 1
 *                          for each post)
 * @param {string} dateTime - date and time when the post was initially created
 * @param {string} author - given author of the post ("Anonymous" if no author given)
 * @param {string} title - given title of the post (blank if no title given)
 * @param {string} entry - given post entry
 * @returns {Object} Returns a new post object.
 */
function createPost(postID, dateTime, author, title, entry) {
  if (!author) {
    author = "Anonymous";
  } else {
    addAuthor(author);
  }
  if (!title) {
    return {"postID": postID, "dateTime": dateTime, "author": author, "entry": entry,
      "comments": []};
  }
  return {"postID": postID, "dateTime": dateTime, "author": author, "title": title,
    "entry": entry, "comments": []};
}

/**
 * Takes the given author and adds them to the list in authors.txt.
 * @param {string} author - author of a post
 */
async function addAuthor(author) {
  let authors = await fs.readFile("authors.txt", "utf8");
  let authorsArray = authors.split("\n");
  for (let i = 0; i < authorsArray.length; i++) {
    if (authorsArray[i] !== author) {
      authors += "\n" + author;
    }
  }
  await fs.writeFile("authors.txt", authors);
}

/**
 * Gets parameters from POST request and creates a new comment object which is written into the
 * posts.json file and then sent to the client.
 * Handles server and client errors, sending appropriate error messages for each error code.
 */
app.post("/addComment", async (req, res) => {
  res.type("text");
  let comment = req.body.comment;
  let postID = req.body.postID;
  let dateTime = getDateTime();
  if (comment) {
    try {
      let posts = await fs.readFile("posts.json", "utf8");
      posts = JSON.parse(posts);
      let numComments = Object.keys(posts[postID].comments).length;
      posts[postID].comments[numComments] = {"postID": postID, "dateTime": dateTime,
        "comment": comment};
      await fs.writeFile("posts.json", JSON.stringify(posts));
      res.type("json").send(posts[postID].comments[numComments]);
    } catch (err) {
      if (err.code === "ENOENT") {
        res.status(SERVER_ERROR_CODE).send("File doesn't exist.");
      } else {
        res.status(SERVER_ERROR_CODE).send("Something went wrong on the server.");
      }
    }
  } else {
    res.status(CLIENT_ERROR_CODE).send("Missing POST parameter: comment.");
  }
});

/**
 * Gets and returns the current date and time, formatted into "MM-DD-YYY HH:MM [AM/PM] (PST)".
 * @returns {string} - the current date and time, formatted into "MM-DD-YYY HH:MM [AM/PM] (PST)"
 */
function getDateTime() {
  let UTCTime = new Date(Date.now());
  let day = UTCTime.getDate();
  let month = UTCTime.getMonth() + 1;
  if (month < TEN) {
    month = "0" + month;
  }
  let year = UTCTime.getFullYear();
  let date = month + "-" + day + "-" + year;
  let dateTime = UTCTime.toString().split(" ");
  let time = dateTime[4];
  let hour = parseInt(time.split(":")[0]);
  let minutes = time.split(":")[1];
  if (hour < MAX_HOUR) {
    time = hour + ":" + minutes + " AM";
  } else if (hour === MILITARY_MAX_HOUR) {
    time = "00:" + minutes + " AM";
  } else if (hour === MAX_HOUR) {
    time = hour + ":" + minutes + " PM";
  } else if (hour > MAX_HOUR) {
    hour = hour - MAX_HOUR;
    time = hour + ":" + minutes + " PM";
  }
  time += (" (PST)");
  return date + " " + time;
}

app.use(express.static("public"));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);