const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop via Axios
public_users.get('/async/books', async function (req, res) {
    try {                                                                         
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);                               
    } catch (error) {                                                             
      return res.status(500).json({ message: error.message });
    }                                                                             
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	// Send JSON response with formatted friends data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/async/isbn/:isbn',async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.send(response.data[req.params.isbn])
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const bookArr = Object.values(books);
    const filteredBooks = bookArr.filter(item => item.author === author);
    res.send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const formattedTitleStr = req.params.title.toLowerCase().trim();
    const bookArr = Object.values(books);
    const filteredBooks = bookArr.filter(item => item.title.toLowerCase().includes(formattedTitleStr));
    res.send(JSON.stringify(filteredBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    res.send(book.reviews)
});

module.exports.general = public_users;
