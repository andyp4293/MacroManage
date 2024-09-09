const jwt = require('jsonwebtoken');

// function to authenticate tokens in the authorization headers of requests
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }
        req.user = user;  
        next();  // proceed to the next route handler
    });
};

module.exports = authenticateToken;



