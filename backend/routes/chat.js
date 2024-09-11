const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const router = express.Router();
require('dotenv').config({ path: '../.env' });

const API_KEY = process.env.AI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

router.post('/', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const context = `
        As a fitness and nutrition chatbot, I am here to help with workouts, diets, or nutrition advice. I can also engage in light small talk such as greetings.
        I will not provide information unrelated to these topics.
    `;
    const {prompt} = req.body; 
    try {
        const message = (await model.generateContent(`${context} ${prompt}`)).response.text();
        return res.status(200).json({
            message: message,
        }); 
    }
    
    catch(error){
        console.log('Error generating chat message:', error)
    }
});

module.exports = router; 

