// require
require('dotenv').config();
const express = require('express');
const app = express();
const users = require('./db/users.json');

// env
const { PORT = 3001 } = process.env;

// Middleware for logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


// endpoint
app.get('/users', async (req, res) => {
    try {
        return res.status(200).json({
            status: true,
            message: 'success!',
            data: users
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = users.find(item => item.id == id);

        if (user == null) {
            return res.status(404).json({
                status: false,
                message: 'not found!',
                data: null
            });
        }

        return res.status(200).json({
            status: true,
            message: 'success!',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
});



// listen app
app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
});