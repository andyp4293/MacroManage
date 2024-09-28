const express = require('express');
const pool = require('../db'); // Import the shared pool
const router = express.Router();
const authenticateToken = require('./authToken');

// this is for the food log page to refresh the weight logs for any changes
router.post('/get_weight_logs', authenticateToken,  async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(`
            SELECT * FROM weight_logs
            WHERE user_id = $1
            ORDER BY weight_date DESC; -- 
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

// for adding weight log to the database 
router.post('/add_weight_log', authenticateToken, async (req, res) => {
    const { weight_lbs, weight_date } = req.body;
    const user_id = req.user.id;

    try {
        // check if a weight log already exists for the given date
        const existingEntry = await pool.query(
            `SELECT * FROM weight_logs WHERE user_id = $1 AND weight_date = $2`,
            [user_id, weight_date]
        );

        // if an entry already exists, update it
        if (existingEntry.rows.length > 0) {
            const updateResult = await pool.query(
                `UPDATE weight_logs SET weight_lbs = $1 WHERE user_id = $2 AND weight_date = $3 RETURNING *`,
                [weight_lbs, user_id, weight_date]
            );
            return res.status(200).json({ message: 'Weight log updated', weightlog: updateResult.rows[0] });
        } else {
            // Insert new weight log entry
            const insertResult = await pool.query(
                `INSERT INTO weight_logs (user_id, weight_lbs, weight_date) VALUES ($1, $2, $3) RETURNING *`,
                [user_id, weight_lbs, weight_date]
            );
            return res.status(201).json({ message: 'Weight log added', weightlog: insertResult.rows[0] });
        }
        
    } catch (error) {
        console.error('Error handling weight log entry:', error);
        res.status(500).send('Server error');
    }
});

// Route to delete a meal_item based on its id
router.delete('/delete_weight_entry/:id', authenticateToken, async (req, res) => {
    const { id: weightId } = req.params;

    try {
        // perform delete on row with the matching id
        const result = await pool.query('DELETE FROM weight_logs WHERE id = $1 RETURNING *', [weightId]);

        if (result.rowCount === 0) {
            // No rows were deleted, meaning no item with that id was found
            return res.status(404).json({ message: 'weight entry not found' });
        }

        // return success message 
        return res.status(200).json({ message: 'Weight entry deleted successfully'});
    } catch (error) {
        console.error('Error deleting meal item:', error);
        return res.status(500).json({ message: 'Server error while deleting weight entry' });
    }
});


router.put('/edit_weight_entry/:id', authenticateToken, async (req, res) => {
    const { id: weightId } = req.params;
    let { weight } = req.body;
    
    if (weight === ""){
        weight = 0; 
    }

    try {
        await pool.query(
            `UPDATE weight_logs SET weight_lbs = $1 WHERE id = $2 RETURNING *`,
            [weight, weightId]
        );

        return res.status(200).json({ message: 'Weight log updated'});
    } catch (error) {
        console.error('Error editing weight entry:', error);
        return res.status(500).json({ message: 'Server error while editing weight entry' });
    }
});


module.exports = router;