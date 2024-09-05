const express = require('express');
const pool = require('../db'); // Import the shared pool
const router = express.Router();

// route to get food item search results based on the query 
router.post('/', async (req, res) => {
    const { query } = req.body;

    try {
        const result = await pool.query(`
            WITH RankedFood AS (
                SELECT *,
                    ROW_NUMBER() OVER (PARTITION BY LOWER(name) ORDER BY CASE
                        -- 1. Exact match first
                        WHEN LOWER(name) = LOWER($2) THEN 1
                        -- 2. Names that start with the query
                        WHEN LOWER(name) LIKE LOWER($1) THEN 2
                        -- 3. Partial matches come last
                        ELSE 3
                    END) AS rank
                FROM food_nutrition_data
                WHERE LOWER(name) LIKE LOWER($1)
            )
            SELECT * FROM RankedFood
            WHERE rank <= 5
            LIMIT 75;
        `, [`${query}%`, query]);
        // for the query, the specifications of the return prioritizes items with just the query in the name, any that contains the name first, and then any that contains the name in general

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).send('Server error');
    }
});



// route to get specific food item by id
router.get('/item', async (req, res) => {
    const { item_id: item_id } = req.query;
    if (!item_id) {
        return res.status(400).json({ error: 'Item ID is required.' });
    }

    try {
        const result = await pool.query(`
            SELECT * FROM food_nutrition_data 
            WHERE id = $1
        `, [item_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(result.rows[0]); // send the specific food item data back to the frontend
    } catch (error) {
        console.error('Error fetching item from database:', error);
        res.status(500).send('Server error');
    }
});

// route to get nutrients of common foods based on a query
router.get('/nutrients', async (req, res) => {
    const foodQuery = req.query.query;
    if (!foodQuery) {
        return res.status(400).json({ error: 'A query parameter is required.' });
    }

    try {
        const result = await pool.query(`
            SELECT name, kcal, total_fat, protein, total_carb 
            FROM food_nutrition_data 
            WHERE LOWER(name) LIKE LOWER($1)
        `, [`%${foodQuery}%`]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No matching foods found' });
        }

        res.json(result.rows); // send the nutrient information back to the frontend
    } catch (error) {
        console.error('Error fetching nutrition data from database:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;