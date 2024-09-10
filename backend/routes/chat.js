const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const router = express.Router();
require('dotenv').config({ path: '../.env' });

const API_KEY = process.env.AI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

router.post('/', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const {prompt} = req.body; 
    try {
        const message = (await model.generateContent(prompt)).response.text();
        return res.status(200).json({
            message: message,
        }); 
    }
    
    catch(error){
        console.log('Error generating chat message')
    }
});

module.exports = router; 

