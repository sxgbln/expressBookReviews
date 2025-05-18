const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (users.some((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({ username: username, password: password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).json(books); // Send the entire 'books' object as a JSON response with a 200 OK status
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get the ISBN from the URL parameter
    const book = books[isbn]; // Access the book object using the ISBN as the key
  
    if (book) {
      res.status(200).json(book); // If the book exists, send it as JSON with a 200 OK
    } else {
      res.status(404).json({ message: "Book not found" }); // If the book doesn't exist, send a 404 Not Found
    }
  });
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const authorBooks = [];
  
    for (const key in books) {
      if (books[key].author === author) {
        authorBooks.push(books[key]);
      }
    }
  
    if (authorBooks.length > 0) {
      res.status(200).json(authorBooks);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const titleBooks = [];
  
    for (const key in books) {
      if (books[key].title === title) {
        titleBooks.push(books[key]);
      }
    }
  
    if (titleBooks.length > 0) {
      res.status(200).json(titleBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  });
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      res.status(200).json(book.reviews); // Send the 'reviews' object of the book
    } else {
      res.status(404).json({ message: "Book not found" }); // Or you could say "Reviews not found"
    }
  });
  
module.exports.general = public_users;
