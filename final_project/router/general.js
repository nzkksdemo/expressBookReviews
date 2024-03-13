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
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const givenAuthor = req.params.author;
    const arrayOfISBNKeys = Object.keys(books);
    let selectedBooks = {};

    arrayOfISBNKeys.forEach(item => {
        if (books[item].author === givenAuthor) {
            selectedBooks[item] = books[item];
        }
    });

    if (Object.keys(selectedBooks).length > 0) {
        return res.send(JSON.stringify(selectedBooks, null, 4));
    } else {
        return res.status(300).json({message: `Unable to find any books by author named '${givenAuthor}'`})
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const givenTitle = req.params.title;
    const arrayOfISBNKeys = Object.keys(books);
    let selectedBooks = {};

    arrayOfISBNKeys.forEach(item => {
        if (books[item].title === givenTitle) {
            selectedBooks[item] = books[item];
        }
    });

    if (Object.keys(selectedBooks).length > 0) {
        res.send(JSON.stringify(selectedBooks, null, 4));
    } else {
        res.status(300).json({message: `Unable to find any books based by the title called '${givenTitle}'`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
