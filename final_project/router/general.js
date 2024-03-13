const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (!isValid(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({ message: 'User successfully registered. Now you can login' });
        } else {
            return res.status(404).json({ message: 'User already exists!' });
        }
    } else {
        if (!username) {
            return res.status(300).json({message: 'User name is required'});
        }

        if (!password) {
            return res.status(300).json({message: 'Password is required'});
        }
    }

    return res.status(404).json({ message: 'Unable to register user.' });
});

const getAllBooks = () => new Promise((resolve, reject) => resolve(books));

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getAllBooks().then(result => res.status(200).send(JSON.stringify(result, null, 4)));
});

const getBookByIsbn = isbn => {
    return new Promise((resolve, reject) => {
        getAllBooks().then(result => {
            const selectedBook = result[isbn];
            if(selectedBook) {
                resolve(selectedBook);
            } else {
                reject(`No book found with the isbn '${isbn}'`);
            }
        });
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    if (isbn) {
        getBookByIsbn(isbn)
        .then(
            value => res.status(200).send(JSON.stringify(value, null, 4)),
            reason => res.status(303).json({message: reason})
        );
    } else {
        // to get below error message change the path above to '/isbn/:isbn?'
        res.status(303).json({message: 'isbn is required'});
    }
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
        return res.send(JSON.stringify(selectedBooks, null, 4));
    } else {
        return res.status(300).json({message: `Unable to find any books based by the title called '${givenTitle}'`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const givenISBN = req.params.isbn;
    const selectedBookReviews = books[givenISBN].reviews;

    if (Object.keys(selectedBookReviews).length > 0) {
        return res.send(JSON.stringify(selectedBookReviews));
    } else {
        return res.status(300).json({message: `There are no reviews yet for the book with ISBN '${givenISBN}' titled '${books[givenISBN].title}'`});
    }
});

module.exports.general = public_users;
