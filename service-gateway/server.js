// module
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// env
const { PORT = 3000, URI = 'http://localhost', SERVICE_USER, SERVICE_INVENTORY } = process.env;

// Middleware for logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Proxy middleware for other services
app.use('/users', createProxyMiddleware({ target: `http://${SERVICE_USER}`, changeOrigin: true }));
app.use('/inventory', createProxyMiddleware({ target: `http://${SERVICE_INVENTORY}`, changeOrigin: true }));

// Start the gateway server
app.listen(PORT, () => {
    console.log(`Gateway is running on http://localhost:${PORT}`);
});
