const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const syncRoutes = require('./routes/sync');
app.use('/api/sync', syncRoutes);

// Placeholder route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Hello World from Backend' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
