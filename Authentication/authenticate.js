require('dotenv').config();

const VALID_API_KEY = process.env.APP_API_KEY;

const authenticateReq = (req, res, next) => {
    const apiKey = req.headers['authorization'];

    if (!apiKey) {
        return res.status(401).json({ error: "Unauthorized: Missing API Key" });
    }

    if (apiKey !== VALID_API_KEY) {
        return res.status(403).json({ error: "Forbidden: Invalid API Key" });
    }

    next(); // API key is valid, proceed to the next middleware or route handler
};

module.exports = authenticateReq;
