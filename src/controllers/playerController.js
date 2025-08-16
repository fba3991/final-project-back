const Player = require('../models/Player');
const Squadra = require('../models/Squadra');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Crea un nuovo giocatore e aggiungilo alla rosa
exports.createPlayer = async (req, res, next) => {
  try {
    const player = await Player.create(req.body);

    // Aggiungi automaticamente il giocatore alla rosa
    let squadra = await Squadra.findOne();
    if (!squadra) {
      // Se non esiste una squadra, creala
      squadra = await Squadra.create({
        nome: 'Squadra Principale',
        annoFondazione: new Date().getFullYear(),
        giocatori: []
      });
    }

    await squadra.aggiungiGiocatore(player._id);

    logger.info(`Nuovo giocatore creato e aggiunto alla rosa: ${player.nome} ${player.cognome}`);
    res.status(201).json({
      status: 'success',
      message: 'Giocatore creato e aggiunto alla rosa con successo',
      data: {
        player
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ottieni tutti i giocatori
exports.getAllPlayers = async (req, res, next) => {
  try {
    const players = await Player.find();
    res.status(200).json({
      status: 'success',
      results: players.length,
      data: {
        players
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ottieni un giocatore specifico
exports.getPlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return next(new AppError('Nessun giocatore trovato con questo ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        player
      }
    });
  } catch (error) {
    next(error);
  }
};

// Aggiorna un giocatore
exports.updatePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!player) {
      return next(new AppError('Nessun giocatore trovato con questo ID', 404));
    }

    logger.info(`Giocatore aggiornato: ${player.nome} ${player.cognome}`);
    res.status(200).json({
      status: 'success',
      data: {
        player
      }
    });
  } catch (error) {
    next(error);
  }
};

// Elimina un giocatore e rimuovilo dalla rosa
exports.deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return next(new AppError('Nessun giocatore trovato con questo ID', 404));
    }

    // Rimuovi il giocatore dalla rosa
    const squadra = await Squadra.findOne();
    if (squadra) {
      await squadra.rimuoviGiocatore(req.params.id);
    }

    logger.info(`Giocatore eliminato e rimosso dalla rosa: ${player.nome} ${player.cognome}`);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 