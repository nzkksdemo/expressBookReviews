const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = username =>{
    const isValidUser = users.filter(user => user.username === username);
    return isValidUser.length > 0;
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter(user => {
      return user.username === username && user.password === password;
    });
  
    if (validusers.length > 0) {
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        return res.status(300).json({message: 'Both Username and Password is required'});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
        accessToken,
        username
        };
    
        return res.status(200).send('User successfully logged in');
    } else {
        return res.status(208).json({ message: 'Invalid Login. Check username and password' });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (isbn && review) {
        const selectedBook = books[isbn];

        if(!selectedBook) {
            return res.status(404).json({message: `Book not found with the isbn '${isbn}'`})
        }

        const isUserReviewExists = selectedBook.reviews[username];
        selectedBook.reviews[username] = review;

        return res.status(200).json({message: `${isUserReviewExists ? 'Updated' : 'Added'} the review`});
    } else {
        return res.status(303).json({message: "Both ISBN and Review is required"});
    }
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (isbn) {
        const selectedBook = books[isbn];

        if(!selectedBook) {
            return res.status(404).json({message: `Book not found with the isbn '${isbn}'`})
        }

        const isUserReviewExists = selectedBook.reviews[username];

        if (isUserReviewExists) {
            delete selectedBook.reviews[username];
            return res.status(200).json({ message: 'Review was deleted' });
        } else {
            return res.status(303).json({message: `There is no review found on the user name '${username}'`});
        }
    } else {
        return res.status(303).json({message: "ISBN is required"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
