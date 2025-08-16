const logger = require('../utils/logger');

// Classe base per gli errori personalizzati
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware per la gestione degli errori
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log dell'errore
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (process.env.NODE_ENV === 'development') {
    // In sviluppo, invia dettagli completi dell'errore
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // In produzione, invia solo informazioni essenziali
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Per errori di programmazione, invia un messaggio generico
      logger.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Qualcosa è andato storto!'
      });
    }
  }
};

// Middleware per gestire le rotte non trovate
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Non è possibile trovare ${req.originalUrl} su questo server!`, 404);
  next(error);
};

// Middleware per la validazione degli errori di Mongoose
const handleMongooseError = (err) => {
  let error = { ...err };
  error.message = err.message;

  // Gestione errori di validazione
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    error = new AppError(`Dati non validi. ${errors.join('. ')}`, 400);
  }

  // Gestione errori di cast (es. ID non valido)
  if (err.name === 'CastError') {
    error = new AppError(`Dato non valido: ${err.value}`, 400);
  }

  // Gestione errori di duplicazione
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    error = new AppError(`Valore duplicato: ${value}. Per favore usa un altro valore!`, 400);
  }

  return error;
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  handleMongooseError
}; 