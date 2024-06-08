const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password) => { //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("New Login");
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;
  if ( ! books[isbn].reviews[username] ) {
        books[isbn].reviews[username] =  review;
        console.log("New review:",books[isbn].reviews);
  } else {
        if ( books[isbn].reviews[username] != review) {
                books[isbn].reviews[username] = review;
		console.log("Updated review:",books[isbn].reviews);
        }
  }
  return res.send("The review for the book with ISBN " + isbn + " has been added/updated.");
});

// Delete an user review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if ( books[isbn].reviews[username] ) {
    console.log("Delete review:",isbn, username);
    delete books[isbn].reviews[username];
    return res.send("Reviews for the ISBN " + isbn + " posted by the user " + username + " deleted.");
  } else {
    return res.send("Thre is no review for ISBN " + isbn + " posted by the user " + username );
  }
});





module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
