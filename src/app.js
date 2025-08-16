const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/squadra', require('./routes/squadraRoutes'));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server in esecuzione sulla porta ${PORT}`);
});

module.exports = app; 