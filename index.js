require('dotenv').config();
const express = require('express');
const app = express();

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

const PORT = process.env.PORT || 8080;

const webhookRoutes = require('./src/routes/webhookRoute');
app.use('/api/webhook', webhookRoutes);

app.get('/', (req, res) => {
  res.send('AI code review agent is running');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
