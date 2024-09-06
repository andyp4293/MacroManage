const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const nutritionRoutes = require('./routes/nutrition');
const mealsRoutes = require('./routes/meals'); 

app.use('/api/nutrition', nutritionRoutes); 
app.use('/api/meals', mealsRoutes); 
app.use('/api/users', usersRoutes);







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
