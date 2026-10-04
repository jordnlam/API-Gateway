const express = require('express');
const app = express();

app.all('/{*path}', (req,res) => {
        console.log(`Backend got a ${req.method} on ${req.originalUtl}`);
        res.send(`Hello from the Backend! (You asked for ${req.originalUrl})`);
});

app.listen(4000, () => {
        console.log('Dummy Backend is running on http://localhost:4000');
})