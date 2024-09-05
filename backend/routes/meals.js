const express = require('express');
const pool = require('../db'); // Import the shared pool
const router = express.Router();

// checks to see if a meal_log row has already been made with the selected date on the front end
router.post('/check_meal_log', async (req, res) => {
    const { meal_date } = req.body;

    try {
        // Check how many logs already exist for the given meal date
        const logResult = await pool.query(`
            SELECT COUNT(*) FROM meal_logs WHERE meal_date = $1
        `, [meal_date]);

        const logCount = parseInt(logResult.rows[0].count, 10);

        if (logCount > 0) { // if there already exists a log, don't do anything
            return res.status(200).json({ message: 'Meal log already exists for this date and user' });
        }

        // if a log doesn't exist with the selected date, add a log with the date
        const insertLogResult = await pool.query(`
            INSERT INTO meal_logs (meal_date)
            VALUES ($1) RETURNING id
        `, [meal_date]);

        return res.status(201).json({ 
            message: 'Meal log created', 
            logId: insertLogResult.rows[0].id 
        });


    } catch (error) {
        console.error('Error checking/creating meal logs:', error);
        return res.status(500).send('Server error');
    }
});

// route to get the id of the meal_log with the the selected date
router.post('/get_log_id', async (req, res) => {
    const { meal_date } = req.body;

    try {
        // Query to get the meal log ID for the provided date 
        const result = await pool.query(`
            SELECT id FROM meal_logs WHERE meal_date = $1 
        `, [meal_date]);

        // If no result is found, return an error
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Meal log not found for this date' });
        }

        // Return the meal log ID
        const meal_log_id = result.rows[0].id;
        return res.status(200).json({ meal_log_id });

    } catch (error) {
        console.error('Error fetching meal log ID:', error);
        return res.status(500).json({ message: 'Server error while fetching meal log ID' });
    }
});

// route to make a new food_items row with given food nutritiion details
router.post('/add_food_item', async (req, res) => {
    const { meal_log_id, food_id, quantity, unit, calories, food_name, meal_type, protein, fats, carbs} = req.body;

    try {
        // Insert the food item into the meal_items table
        const result = await pool.query(`
            INSERT INTO meal_items (meal_log_id, food_id, food_name, quantity, unit, calories, meal_type, protein, fats, carbs)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
        `, [meal_log_id, food_id, food_name, quantity, unit, calories, meal_type, protein, fats, carbs]);

        // Return success message with the new item's ID
        return res.status(201).json({ message: 'Food item added successfully', itemId: result.rows[0].id });

    } catch (error) {
        console.error('Error adding food item:', error);
        return res.status(500).json({ message: 'Server error while adding food item' });
    }
});

// route to get meal items based on its meal_log_id and meal_type
router.get('/get_items', async (req, res) => {
    const { meal_log_id, meal_type } = req.query; // get both meal_log_id and meal_type
    try {
        const result = await pool.query(`
            SELECT * FROM meal_items 
            WHERE meal_log_id = $1 AND meal_type = $2
        `, [meal_log_id, meal_type]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching meal items:', error);
        res.status(500).send('Server error');
    }
});

// Route to delete a meal_item based on its id
router.delete('/delete_item/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Perform the DELETE query
        const result = await pool.query(
            'DELETE FROM meal_items WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            // No rows were deleted, meaning no item with that id was found
            return res.status(404).json({ message: 'Meal item not found' });
        }

        // return success message 
        return res.status(200).json({ message: 'Meal item deleted successfully', deletedItem: result.rows[0] });
    } catch (error) {
        console.error('Error deleting meal item:', error);
        return res.status(500).json({ message: 'Server error while deleting meal item' });
    }
});

module.exports = router; 



