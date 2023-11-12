// require
require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const _ = require('lodash');
const inventory = require('./db/inventory.json');

// env
const { PORT = 3001, SERVICE_PURCHASE } = process.env;

// Middleware for logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// helper
const getPruchaseByUserId = async (userId) => {
    try {
        const response = await axios.get(`http://${SERVICE_PURCHASE}/pruchase/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching purchases:', error.message);
        throw error;
    }
}

const combinedData = async (userId) => {
    try {
        // get data from service purchase
        const purchases = await getPruchaseByUserId(userId);

        // find data according user_id
        const userInventory = _.find(inventory, { 'user_id': userId });

        // if found
        if (userInventory) {
            userInventory.purchase_info = purchases.data.map(purchase => _.omit(purchase, 'user_id'));
        }

        return userInventory;
    } catch (error) {
        console.error('Error combining data:', error.message);
        throw error;
    }
}

// endpoint
app.get('/inventory/user/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const inventory = await combinedData(id);

        if (inventory == null) {
            return res.status(404).json({
                status: false,
                message: 'not found!',
                data: null
            });
        };

        return res.status(200).json({
            status: true,
            message: 'success!',
            data: inventory
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