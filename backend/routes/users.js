const express = require('express');
const pool = require('../db'); // Import the shared pool
const router = express.Router();

// route for a user to sign up for an account
router.post('/signup', async (req, res) => {
    const {email, password} = req.body; 

    try {
        // checks to see if there already has been an account made with the inputted email
        const check = await pool.query(`
            SELECT * FROM users
            WHERE email = $1`, 
            [email]
        ); 
        if (check.rows.length > 0) { // if the length is greater than 0 then the email is already in use 
            return res.status(409).json({message: 'Email is already in use'});  
        }

        // if email not already in use, insert new row into users table with the inputted email and password
        await pool.query(`
            INSERT INTO users (email, password) 
            VALUES ($1, $2) 
        `, [email, password]);
        

        return res.status(200).json({message: 'Account signed up successfully'}); 

    }
    catch (error) {
        console.log('Error checking email', error);
    }
        
    
});

module.exports = router; 