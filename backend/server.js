const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/tdl', require('./routes/tdl'));
app.use('/api/tsf', require('./routes/tsf'));
app.use('/api/ac', require('./routes/ac'));
app.use('/api/dc', require('./routes/dc'));
app.use('/api/hvac', require('./routes/hvac'));
app.use('/api/gen-tsw', require('./routes/genTsw'));
app.use('/api/autre', require('./routes/autre'));
app.use('/api/besoin', require('./routes/besoin'));
app.use('/api/fournisseurs', require('./routes/fournisseurs'));
app.use('/api/fabricant', require('./routes/fabricant'));
app.use('/api/migration', require('./routes/migration'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Infrastructure Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
