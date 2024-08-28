const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const NUTRITIONIX_APP_ID = 'bb3b5396';
const NUTRITIONIX_API_KEY = 'c698ad16874f68c0a8c20b857cae7233';


app.post('/api/nutrition', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});