const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here

  return res.status(300).json({message: "Yet to be implemented"});
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

public_users.get('/reviewgood/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const username = "myself";
  const review = "good";
  if ( ! books[isbn].reviews[username] ) {
	console.log("No review:", isbn, username);
	books[isbn].reviews[username] =  review;
  } else {
	console.log("Review:", isbn, username, books[isbn].reviews[username]);
	if ( books[isbn].reviews[username] != review) {
		books[isbn].reviews[username] = review;
	}
  }
  return res.send(JSON.stringify(books[isbn].reviews,null,4))
});

public_users.get('/reviewbad/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const username = "myself";
  const review = "bad";
  if ( ! books[isbn].reviews[username] ) {
        console.log("No review:", isbn, username);
        books[isbn].reviews[username] =  review;
  } else {
        console.log("Review:", isbn, username, books[isbn].reviews[username]);
        if ( books[isbn].reviews[username] != review) {
                books[isbn].reviews[username] = review;
        }
  }
  return res.send("The review for the book with ISBN " + isbn + " has been added/updated.");
});

public_users.get('/reviewdelete/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const username = "myself";
  if ( books[isbn].reviews[username] ) {
    console.log("Delete review:",isbn, username);
    delete books[isbn].reviews[username];
    return res.send("Reviews for the ISBN " + isbn + " posted by the user " + username + " deleted.");
  } else {
    return res.send("Thre is no review for ISBN " + isbn + " posted by the user " + username );
  }
});





module.exports.general = public_users;
