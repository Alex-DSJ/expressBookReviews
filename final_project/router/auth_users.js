const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: 'Shijun',
        password: '123456'
    }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
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

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.user.username;
    const {review} = req.query;

    if (!review) res.status(400).json({ message: "Review is required" });
    if (!books[req.params.isbn]) res.status(404).json({ messagee: 'Book not found' });

    books[req.params.isbn].reviews[username] = review;

    res.send('Review posted successfully');
});

regd_users.delete("/auth/review/:isbn", (req, res) => {                      
    const isbn = req.params.isbn
    const username = req.user.username;                         
                                                                                
    if (!books[isbn]) return res.status(404).json({ message: "ISBN not found" }); 
    if (!books[isbn].reviews[username]) return res.status(404).json({ message: "No review found for this user" });                                                
                                                            
    delete books[isbn].reviews[username];                                         
                                                            
    res.send("Review deleted successfully");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
