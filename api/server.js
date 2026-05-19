const express = require('express');
const app = express();

app.use(express.json());

// Home page route
app.get('/', (req, res) => {
    res.send('Roblox serverless backend is online on Vercel!');
});

// The secret endpoint Roblox will send data to
app.post('/roblox-data', (req, res) => {
    const { username, action } = req.body;
    
    // Reply back to Roblox
    res.json({ 
        status: "success", 
        message: `Hello ${username}, Vercel received your action!` 
    });
});

// Required for Vercel serverless environment
module.exports = app;
