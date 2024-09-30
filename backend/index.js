const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const nutritionRoutes = require('./routes/nutrition');
const mealsRoutes = require('./routes/meals'); 
const usersRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const weightRoutes = require('./routes/weight');

app.use('/api/nutrition', nutritionRoutes); 
app.use('/api/meals', mealsRoutes); 
app.use('/api/users', usersRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/weight', weightRoutes); 







app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
