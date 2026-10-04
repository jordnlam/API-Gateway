const express = require('express');
const app = express();

app.use(express.json());

app.all('/{*path}', (req,res) => {
        console.log(`Backend got a ${req.method} on ${req.originalUtl}`);
                res.json({
                        message: "Hello from the backend!",
                        urlRequested: req.originalUrl,
                        dataRecevived: req.body
                });
});

app.listen(4000, () => {
        console.log('Dummy Backend is running on http://localhost:4000');
})