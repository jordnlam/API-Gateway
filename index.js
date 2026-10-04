const express = require('express');
const app = express();

// Wildcard '*' means 'match any URL path'
// app.all() means "match GET, POST, PUT, DELETE, etc"
app.all('/{*path}', (req, res) => {
        // 1. Log what we caught
        console.log(`Intercepted a ${req.method} request going to ${req.originalUrl}`);
        // 2. Look at the headers the client sent
        console.log('Headers provided:', req.headers);
        // 3. Temporarily send a basic response so the browser doesn't hand forever
        res.send('Gateway intercepted the traffic successfully!');
});

const PORT = 3000;
app.listen(PORT, () => {
        console.log(`API Gateway is running on http://localhost:${PORT}`);
});