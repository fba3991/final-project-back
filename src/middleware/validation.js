const Joi = require('joi');
const { AppError } = require('./errorHandler');

// Schema di validazione per i giocatori
const playerSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Il nome è obbligatorio',
      'string.min': 'Il nome deve contenere almeno {#limit} caratteri',
      'string.max': 'Il nome non può superare {#limit} caratteri',
      'any.required': 'Il nome è obbligatorio'
    }),

  cognome: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Il cognome è obbligatorio',
      'string.min': 'Il cognome deve contenere almeno {#limit} caratteri',
      'string.max': 'Il cognome non può superare {#limit} caratteri',
      'any.required': 'Il cognome è obbligatorio'
    }),

  dataNascita: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'La data di nascita deve essere una data valida',
      'date.max': 'La data di nascita non può essere nel futuro',
      'any.required': 'La data di nascita è obbligatoria'
    }),

  nazionalita: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'La nazionalità è obbligatoria',
      'string.min': 'La nazionalità deve contenere almeno {#limit} caratteri',
      'string.max': 'La nazionalità non può superare {#limit} caratteri',
      'any.required': 'La nazionalità è obbligatoria'
    }),

  ruolo: Joi.string()
    .valid('portiere', 'difensore', 'centrocampista', 'attaccante')
    .required()
    .messages({
      'any.only': 'Il ruolo deve essere uno tra: portiere, difensore, centrocampista, attaccante',
      'any.required': 'Il ruolo è obbligatorio'
    }),

  partiteGiocate: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Le partite giocate devono essere un numero',
      'number.integer': 'Le partite giocate devono essere un numero intero',
      'number.min': 'Le partite giocate non possono essere negative',
      'any.required': 'Le partite giocate sono obbligatorie'
    }),

  cartelliniGialli: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'I cartellini gialli devono essere un numero',
      'number.integer': 'I cartellini gialli devono essere un numero intero',
      'number.min': 'I cartellini gialli non possono essere negativi',
      'any.required': 'I cartellini gialli sono obbligatori'
    }),

  cartelliniRossi: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'I cartellini rossi devono essere un numero',
      'number.integer': 'I cartellini rossi devono essere un numero intero',
      'number.min': 'I cartellini rossi non possono essere negativi',
      'any.required': 'I cartellini rossi sono obbligatori'
    }),

  assist: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Gli assist devono essere un numero',
      'number.integer': 'Gli assist devono essere un numero intero',
      'number.min': 'Gli assist non possono essere negativi',
      'any.required': 'Gli assist sono obbligatori'
    }),

  gol: Joi.number()
    .integer()
    .min(0)
    .when('ruolo', {
      is: 'portiere',
      then: Joi.number().max(0).messages({
        'number.max': 'I portieri non possono segnare gol'
      }),
      otherwise: Joi.number().required()
    })
    .messages({
      'number.base': 'I gol devono essere un numero',
      'number.integer': 'I gol devono essere un numero intero',
      'number.min': 'I gol non possono essere negativi',
      'any.required': 'I gol sono obbligatori per i giocatori di movimento'
    })
});

// Middleware di validazione
const validatePlayer = (req, res, next) => {
  const { error } = playerSchema.validate(req.body, {
    abortEarly: false, // Restituisce tutti gli errori
    stripUnknown: true // Rimuove i campi non definiti nello schema
  });

  if (error) {
    const errorMessage = error.details
      .map(detail => detail.message)
      .join('. ');
    
    return next(new AppError(errorMessage, 400));
  }

  next();
};

module.exports = {
  validatePlayer
}; 