const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      
      // Eventi di connessione
      mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err}`);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
        if (retries < maxRetries) {
          retries++;
          setTimeout(connect, 5000 * retries); // Backoff esponenziale
        }
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        retries = 0;
      });

    } catch (error) {
      logger.error(`Error connecting to MongoDB: ${error.message}`);
      if (retries < maxRetries) {
        retries++;
        logger.info(`Retrying connection (${retries}/${maxRetries})...`);
        setTimeout(connect, 5000 * retries);
      } else {
        logger.error('Max retries reached. Could not connect to MongoDB');
        process.exit(1);
      }
    }
  };

  await connect();
};

module.exports = connectDB; 