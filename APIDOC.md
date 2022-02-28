# Discussion Board API Documentation
The Discussion Board API provides the various information about the posts in the discussion board.
date/time a post was posted, a post's title and author
(if available), the post entry text content, and any comments that the post has.

## Get all of the posts currently in this service.
**Request Format:** /posts

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a JSON of all of the posts currently in this API.


**Example Request:** /posts

**Example Response:**
```json
{
"0": {
  "postID": "0",
  "dateTime": "05-21-2020 5:10 PM (PST)",
  "author": "Anonymous",
  "entry": "Node.js was really confusing at first. Anyone agree?",
  "comments": [ ]
}
}
```

**Error Handling:**
- Possible 500 (server error) errors (all plain text):
  - If passed file to read from doesn't exist / is destroyed, returns an error with this message:
    `File doesn't exist.`
  - If something else goes wrong, returns an error with this message: `Something went wrong on the server.`


## Get all of the authors that are currently in this service.
**Request Format:** /authors

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Returns a list of all of the authors that have made posts.


**Example Request:** /authors

**Example Response:**
```
Anonymous
Tara
Robert
Jasper
Therese
...
```

**Error Handling:**
- Possible 500 (server error) errors (all plain text):
  - If passed file to read from doesn't exist / is destroyed, returns an error with this message:
    `File doesn't exist.`
  - If something else goes wrong, returns an error with this message: `Something went wrong on the server.`

## Create a new post.
**Request Format:** /addPost endpoint with POST parameters of `title`, `author`, and `entry`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid `entry` (if `title` is left blank, no title is added; if `author` is
left blank, `author` is set to "Anonymous") will add the new post to the posts.json file.

**Example Request:** /addPost with POST parameters of `title=Confused about SQl`,
`entry=I don't understand how GROUP BY works.`

**Example Response:**
```json
{
    "postID": "1",
    "dateTime": "05-21-2020 7:05 PM (PST)",
    "author": "Anonymous",
    "title": "Confused about SQl",
    "entry": "I don't understand how GROUP BY works.",
    "comments": []
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If missing entry parameter, an error is returned with this message:
    `Missing POST parameter: entry.`
- Possible 500 (server error) errors (all plain text):
  - If passed file to read from doesn't exist / is destroyed, returns an error with this message:
    `File doesn't exist.`
  - If something else goes wrong, returns an error with this message:
    `Something went wrong on the server.`

## Create a new comment.
**Request Format:** /addComment endpoint with POST parameters of `comment`, `postID`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid `comment` and `postID` will add the new comment to the post that
matches the `postID` and will add the new comment to the posts.json file.

**Example Request:** /addComment with POST parameters of
`comment=I'm a little confused by GROUP BY as well.`, `postID=1`

**Example Response:**
```json
{
    "postID": "1",
    "dateTime": "05-21-2020 7:10 PM (PST)",
    "comment": "I'm a little confused by GROUP BY as well."
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If missing entry parameter, an error is returned with this message:
    `Missing POST parameter: entry.`
- Possible 500 (server error) errors (all plain text):
  - If passed file to read from doesn't exist / is destroyed, returns an error with this message:
    `File doesn't exist.`
  - If something else goes wrong, returns an error with this message:
    `Something went wrong on the server.`