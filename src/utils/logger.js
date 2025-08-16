const winston = require('winston');
const path = require('path');

// Definizione dei livelli di log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Selezione del livello di log in base all'ambiente
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Definizione dei colori per ogni livello
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Aggiunta dei colori a winston
winston.addColors(colors);

// Definizione del formato dei log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Definizione delle destinazioni dei log
const transports = [
  // Console per tutti i log
  new winston.transports.Console(),
  
  // File per errori
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),
  
  // File per tutti i log
  new winston.transports.File({ 
    filename: path.join('logs', 'all.log') 
  }),
];

// Creazione del logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Gestione delle eccezioni non catturate
logger.exceptions.handle(
  new winston.transports.File({ 
    filename: path.join('logs', 'exceptions.log') 
  })
);

// Gestione dei rejection non gestiti
logger.rejections.handle(
  new winston.transports.File({ 
    filename: path.join('logs', 'rejections.log') 
  })
);

module.exports = logger; 