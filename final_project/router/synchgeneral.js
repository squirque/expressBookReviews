const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
//  console.log("New Register", username, password);
  if (username && password) {
    if (! isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn],null,4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  console.log(author);
  let books_by_author = [];
  for (key in books) {
    if ( books[key].author == author ) {
      books_by_author.push(books[key]);
    }
  }
  return res.send(JSON.stringify(books_by_author,null,4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title = req.params.title;
   console.log(title);
   let books_by_title = [];
   for (key in books) {
      if ( books[key].title == title ) {
         books_by_title.push(books[key]);
      }
   }
   return res.send(JSON.stringify(books_by_title,null,4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews,null,4))
});

module.exports.general = public_users;
