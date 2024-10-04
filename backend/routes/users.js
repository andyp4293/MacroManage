const express = require('express');
const pool = require('../db'); // Import the shared pool
const router = express.Router();
const bcrypt = require('bcryptjs'); // for encrypting the passwords
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
require('dotenv').config();  // load .env file
const crypto = require('crypto');



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

router.post('/forgotpassword', async (req, res) => {
    let { email } = req.body;
    email = email.toLowerCase();
    console.log(process.env.EMAIL_ID, process.env.EMAIL_PASSWORD); 

    try {
        // Check if an account with this email exists
        const check = await pool.query(`
            SELECT * FROM users
            WHERE email = $1`, 
            [email]
        ); 
        if (check.rows.length == 0) { 
            // If the email is not registered
            return res.status(404).json({ message: 'Email is not registered' });  
        }

        // Nodemailer setup to send email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT, 
            auth: {
                user: process.env.EMAIL_ID,  // email address
                pass: process.env.EMAIL_PASSWORD  // pass of the email address
            }
        });


        // email template
        const mailTemplate = (content, buttonUrl, buttonText) => {
            return `<!DOCTYPE html>
            <html>
            <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
                <div
                    style="
                    max-width: 400px;
                    margin: 10px;
                    background-color: #fafafa;
                    padding: 25px;
                    border-radius: 20px;
                    "
                >
                <p style="text-align: left;">
                    ${content}
                </p>
                <a href="${buttonUrl}" target="_blank">
                    <button
                        style="
                        background-color: #343d46;
                        border: 0;
                        width: 200px;
                        height: 30px;
                        border-radius: 6px;
                        color: #fff;
                    "
                    >
                    ${buttonText}
                    </button>
                </a>
                <p style="text-align: left;">
                    If you are unable to click the above button, copy paste the below URL into your address bar
                </p>
                    <a href="${buttonUrl}" target="_blank">
                        <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">
                        ${buttonUrl}
                        </p>
                    </a>
                </div>
            </body>
            </html>`;
        };

        const resetToken = crypto.randomBytes(32).toString('hex');

        // store token inside users table of the account that you are resetting password
        await pool.query(`
            UPDATE users 
            SET reset_token = $1, reset_token_expiration = NOW() + INTERVAL '1 hour' 
            WHERE email = $2`, 
            [resetToken, email]
        );

        const frontendurl = process.env.FRONTEND_URL; 
        const resetUrl = `${frontendurl}/reset-password?token=${resetToken}`;
        const emailContent = mailTemplate(
            'You requested a password reset. Please click the button below to reset your password.',
            resetUrl,
            'Reset Password'
        );

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'Password Reset MacroManage',
            html: emailContent
        };
        
        transporter.sendMail(mailOptions, function (error, _) {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                return res.status(200).json({ message: 'Reset password email sent.' });
            }
        });

    } catch (error) {
        console.log('Error checking email', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// route for a user to reset password
router.post('/resetpassword', async (req, res) => {
    const {resetToken, newPassword} = req.body; 

    try {
        // checks to see if the reset token is still valid 
        const user = await pool.query(`
            SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiration > NOW()`, 
            [resetToken]
        );

        if (user.rows.length > 0) { // if the length is greater than 0 then the reset token is still valid
            await pool.query(`
                UPDATE users SET reset_token = NULL, reset_token_expiration = NULL 
                WHERE reset_token = $1`, 
                [resetToken]
            ); // removes the expired reset token

            return res.status(409).json({message: 'Link is expired, please request a new password reset'});  
        }

         // if email is not already in use, hash the password before inserting it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // update the user's password and clear the reset token
        await pool.query(`
            UPDATE users SET password = $1, reset_token = NULL, reset_token_expiration = NULL 
            WHERE id = $2`, 
            [hashedPassword, user.rows[0].id]
        );

        await pool.query(
            'INSERT INTO nutrition_goals (user_id) VALUES ($1)',
            [user.rows[0].id] // this ensures that every has a nutrition_goals row
        );

        return res.status(200).json({message: 'Password reset successfully!'}); 

    }
    catch (error) {
        console.log('Error resetting password', error);
    }
        
    
});





module.exports = router; 