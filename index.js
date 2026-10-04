const express = require('express');
const http = require('http');
const app = express();

app.all('/{*path}', (req, res) => {
        // Construct the exact options for the backend request
        const options = {
                hostname: 'localhost',
                port: 4000,
                path: req.originalUrl,
                method: req.method,
                headers: { ...req.headers }
        };

        // Strip out the 'host' header
        delete options.headers['host'];

        // Create the outbound request to the backend
        const proxyReq = http.request(options, (backendRes) => {
                res.writeHead(backendRes.statusCode, backendRes.headers);
                backendRes.pipe(res);
        });

        // Handle errors (e.g. if you forget to start backend.js)
        proxyReq.on('error', (err) => {
                console.error('Gateway failed to reach backend:', error.message);
                res.status(502).send('502 Bad Gateway');
        });

        // Stream the request body from the client directly to the backend
        req.pipe(proxyReq);
});

const PORT = 3000;
app.listen(PORT, () => {
        console.log(`API Gateway is running on http://localhost:${PORT}`);
});