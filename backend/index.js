const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const NUTRITIONIX_APP_ID = 'e2b1bbec';
const NUTRITIONIX_API_KEY = '8155a4c4fc479970663169aa9348a0e5';

// queries for search results
app.post('/api/nutrition', async (req, res) => { // to get search results when the user sends a search query for a food item 
    const { query } = req.body; 
    try {
        const response = await axios.post('https://trackapi.nutritionix.com/v2/search/instant', 
            {
                query: query
            }, 
            {
                headers: {
                    'x-app-id': NUTRITIONIX_APP_ID,
                    'x-app-key': NUTRITIONIX_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data); // sends the Nutritionix API response data back to the frontend
        } catch (error) {
        console.error('Error fetching data from Nutritionix:', error);
        res.status(500).send('Server error');
    }
});

// to get the nutrients of branded items
app.get('/api/nutrition/item', async (req, res) => {
    const { nix_item_id } = req.query; // Extracting the item ID from the query parameters
    console.log(nix_item_id);
    try {
        const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item?nix_item_id=${nix_item_id}`, 
            {
                headers: {
                    'x-app-id': NUTRITIONIX_APP_ID,
                    'x-app-key': NUTRITIONIX_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        res.json(response.data); // sends the Nutritionix API response data back to the frontend
    } catch (error) {
        console.error('Error fetching item data from Nutritionix', error);
        res.status(500).send('Server error');
    }
});


// to get nutrients of common foods
app.get('/api/nutrition/nutrients', async (req, res) => {
    const foodQuery = req.query.query;  // Extract the query parameter from the GET request
    if (!foodQuery) {
        return res.status(400).json({ error: 'A query parameter is required.' });
    }

    try {
        const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', 
            {
                query: foodQuery
            }, 
            {
                headers: {
                    'x-app-id': NUTRITIONIX_APP_ID,
                    'x-app-key': NUTRITIONIX_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data); // Send the Nutritionix API response data back to the frontend
    } catch (error) {
        console.error('Error fetching nutrition data from Nutritionix: ', error.message);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});