const express = require('express');
const https = require('https');  // Import the https module
const fs = require('fs');        // Import the fs module to read the certificate and key
const cors = require('cors');
require('dotenv').config({ path: './.env' });

const app = express();
const port = process.env.PORT || 5000;

// Load the self-signed SSL certificate and key
const sslOptions = {
    key: fs.readFileSync('/etc/ssl/private/selfsigned.key'),
    cert: fs.readFileSync('/etc/ssl/certs/selfsigned.crt')
};

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

// Create an HTTPS server and listen on the specified port
https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Server is running securely on https://localhost:${port}`);
});
