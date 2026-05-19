const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// A simple home page for your website
app.get('/', (req, res) => {
    res.send('Roblox backend server is online!');
});

// The secret endpoint Roblox will send data to
app.post('/roblox-data', (req, res) => {
    const { username, action } = req.body;
    
    console.log(`Received from Roblox: User ${username} triggered action: ${action}`);
    
    // Reply back to Roblox
    res.json({ 
        status: "success", 
        message: `Hello ${username}, the website received your action!` 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
