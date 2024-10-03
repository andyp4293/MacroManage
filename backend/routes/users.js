const express = require('express');
const pool = require('../db'); // Import the shared pool
const router = express.Router();
const bcrypt = require('bcryptjs'); // for encrypting the passwords
const jwt = require('jsonwebtoken');
require('dotenv').config();  // load .env file



// route for a user to sign up for an account
router.post('/signup', async (req, res) => {
    const {password, username} = req.body; 
    let { email } = req.body;
    email = email.toLowerCase();

    try {
        // checks to see if there already has been an account made with the inputted email or username
        const [checkEmail, checkUsername] = await Promise.all([
            pool.query('SELECT * FROM users WHERE email = $1', [email]),
            pool.query('SELECT * FROM users WHERE username = $1', [username])
        ]);

        if (checkEmail.rows.length > 0) { // if the length is greater than 0 then the email is already in use 
            return res.status(409).json({message: 'Email is already in use.'});  
        }


        if (checkUsername.rows.length > 0) { // if the length is greater than 0 then the email is already in use 
            return res.status(409).json({message: 'Username is taken.'});  
        }

         // if email is not already in use, hash the password before inserting it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // insert new row into the users table with the inputted email and hashed password
        const user = await pool.query(
            'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id',
            [email, hashedPassword, username]
        );

        await pool.query(
            'INSERT INTO nutrition_goals (user_id) VALUES ($1)',
            [user.rows[0].id] // this ensures that every has a nutrition_goals row
        );

        return res.status(200).json({message: 'Account signed up successfully'}); 

    }
    catch (error) {
        console.log('Error checking email', error);
    }
        
    
});

// route for a returning user to log in 
router.post('/signin', async (req, res) => {
    const { password } = req.body;
    let { email } = req.body;
    email = email.toLowerCase();

    try {
        // checks to see if an account with this email exists exists 
        const check = await pool.query(`
            SELECT * FROM users
            WHERE email = $1`, 
            [email]
        ); 
        if (check.rows.length == 0) { // if the length is 0 then the account with that email doesn't exist
            return res.status(404).json({message: 'Email or password is incorrect.'});  
        }

        // if email not already in use, grab the user information
        const user = check.rows[0]; 
        // compares the hashed password with the plain text password using bcrypt
        const validPassword = await bcrypt.compare(password, user.password); 

        if (!validPassword) {
            return res.status(404).json({message: 'Email or password is incorrect'});  
        }

        // If the login is successful, generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username}, // user data
            process.env.JWT_SECRET, // 
            { expiresIn: '6h' } // token expires in 6 hours
        );

        // send the token in the response
        return res.status(200).json({
            message: 'Login successful',
            token: token,  // Send the JWT token to the frontend
        }); 

    }
    catch (error) {
        console.log('Error checking email', error);
    }
        
    
});

// route for checking if an email is registered for forgot password 
router.post('/forgotpassword', async (req, res) => {
    let { email } = req.body;
    email = email.toLowerCase();

    try {
        // checks to see if an account with this email exists exists 
        const check = await pool.query(`
            SELECT * FROM users
            WHERE email = $1`, 
            [email]
        ); 
        if (check.rows.length == 0) { // if the length is 0 then the account with that email doesn't exist
            return res.status(404).json({message: 'Email is not registered'});  
        }

        // send success if email is registered
        return res.status(200).json({message: 'Login successful'}); 

    }
    catch (error) {
        console.log('Error checking email', error);
    }
        
    
});


module.exports = router; 