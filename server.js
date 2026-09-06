require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json());
const http = require('http');
const PORT = 8080

const webhookRoutes = require('./src/routes/webhookRoute');

const server = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type':'text/plain' });
    res.end('Hello World\n')
})

app.use('api/webhook',webhookRoutes)

server.listen(PORT,() => {
    console.log(process.env.GITHUB_TOKEN)
    console.log(`Server running at http://localhost:${PORT}`);
});