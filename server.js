require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json());
const http = require('http');
const PORT = 8080

const webhookRoutes = require('./src/routes/webhookRoute');
app.use('/api/webhook',webhookRoutes)

app.listen(PORT,() => {
    console.log(process.env.GITHUB_TOKEN)
    console.log(`Server running at http://localhost:${PORT}`);
});