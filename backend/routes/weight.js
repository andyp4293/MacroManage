const express = require('express');
const pool = require('../db'); // Import the shared pool
const router = express.Router();
const authenticateToken = require('./authToken');


router.post('/get_weight_logs', authenticateToken,  async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(`
            SELECT * FROM weight_log 
            WHERE id = $1
        `, [user_id]);

        // if weight logs were not found under this account id, return empty array 
        if (result.rows.length === 0) {
            return res.status(200).json({ message: 'No weight logs found', weightlogs: [] });
        }

        // if weight logs were found, return them in the response
        return res.status(200).json({ message: 'Success', weightlogs: result.rows });
        
    } catch (error) {
        console.error('Error fetching weight logs from database:', error);
        res.status(500).send('Server error'); 
    }
});


router.post('/add_weight_log', authenticateToken,  async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(`
            SELECT * FROM weight_log 
            WHERE id = $1
        `, [user_id]);

        // if weight logs were not found under this account id, return empty array 
        if (result.rows.length === 0) {
            return res.status(200).json({ message: 'No weight logs found', weightlogs: [] });
        }

        // if weight logs were found, return them in the response
        return res.status(200).json({ message: 'Success', weightlogs: result.rows });
        
    } catch (error) {
        console.error('Error fetching weight logs from database:', error);
        res.status(500).send('Server error'); 
    }
});

module.exports = router;