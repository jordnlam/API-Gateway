const express = require('express');
const http = require('http');
const app = express();

// Rate Limiter Configuation
const CAPACITY = 5; // max burst of 5 requests
const REFILL_RATE = 1; // 1 token added per second
const buckets = new Map(); // In-memory store: IP -> { tokens, lastRefill }

// Rate Limiter Middleware
const rateLimiter = (req, res, next) => {
        const userIP = req.ip;
        const now = Date.now();

        // Initialise the bucket if the user is low
        if (!buckets.has(userIP)) {
                buckets.set(userIP, { tokens: CAPACITY, lastRefill: now });
        }

        const bucket = buckets.get(userIP);

        // Lazy Refill Calculation
        const timePassedSeconds = (now - bucket.lastRefill) / 1000;
        const newTokens = timePassedSeconds * REFILL_RATE;

        // Add new tokens, but cap it at max capacity
        bucket.tokens = Math.min(CAPACITY, bucket.tokens + newTokens);
        bucket.lastRefill = now;

        // Accept or reject
        if (bucket.tokens >= 1) {
                bucket.tokens -= 1; // Consume a token
                next();
        } else {
                res.status(429).send('429 Too Many Requests - Slow down!');
        }
};

app.all('/{*path}', rateLimiter, (req, res) => {
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
                console.error('Gateway failed to reach backend:', err.message);
                res.status(502).send('502 Bad Gateway');
        });

        // Stream the request body from the client directly to the backend
        req.pipe(proxyReq);
});

const PORT = 3000;
app.listen(PORT, () => {
        console.log(`API Gateway is running on http://localhost:${PORT}`);
});