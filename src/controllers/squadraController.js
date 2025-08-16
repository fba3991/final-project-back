const Squadra = require('../models/Squadra');
const Player = require('../models/Player');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Crea una nuova squadra
exports.createSquadra = async (req, res, next) => {
  try {
    const { nome, annoFondazione } = req.body;

    // Verifica se esiste già una squadra
    const squadraEsistente = await Squadra.findOne({ nome });
    if (squadraEsistente) {
      return next(new AppError('Esiste già una squadra con questo nome', 400));
    }

    const squadra = await Squadra.create({
      nome,
      annoFondazione,
      giocatori: []
    });

    logger.info(`Nuova squadra creata: ${squadra.nome}`);
    res.status(201).json({
      status: 'success',
      data: {
        squadra
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ottieni la rosa completa della squadra
exports.getRosa = async (req, res, next) => {
  try {
    const squadra = await Squadra.findOne()
      .populate({
        path: 'giocatori',
        select: 'nome cognome ruolo partiteGiocate gol assist cartelliniGialli cartelliniRossi'
      });

    if (!squadra) {
      return next(new AppError('Nessuna squadra trovata', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        squadra,
        statistiche: {
          numeroGiocatori: squadra.numeroGiocatori,
          giocatoriPerRuolo: squadra.giocatoriPerRuolo
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Aggiungi un giocatore alla rosa
exports.aggiungiGiocatore = async (req, res, next) => {
  try {
    const { giocatoreId } = req.params;

    // Verifica se il giocatore esiste
    const giocatore = await Player.findById(giocatoreId);
    if (!giocatore) {
      return next(new AppError('Giocatore non trovato', 404));
    }

    // Ottieni la squadra
    let squadra = await Squadra.findOne();
    if (!squadra) {
      // Se non esiste una squadra, creala
      squadra = await Squadra.create({
        nome: 'Squadra Principale',
        annoFondazione: new Date().getFullYear(),
        giocatori: []
      });
    }

    // Aggiungi il giocatore alla rosa
    await squadra.aggiungiGiocatore(giocatoreId);
    
    // Popola i dati del giocatore per la risposta
    await squadra.populate({
      path: 'giocatori',
      match: { _id: giocatoreId }
    });

    logger.info(`Giocatore ${giocatore.nome} ${giocatore.cognome} aggiunto alla rosa`);
    res.status(200).json({
      status: 'success',
      message: 'Giocatore aggiunto alla rosa con successo',
      data: {
        giocatore: squadra.giocatori[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

// Rimuovi un giocatore dalla rosa
exports.rimuoviGiocatore = async (req, res, next) => {
  try {
    const { giocatoreId } = req.params;

    const squadra = await Squadra.findOne();
    if (!squadra) {
      return next(new AppError('Nessuna squadra trovata', 404));
    }

    // Verifica se il giocatore è nella rosa
    if (!squadra.giocatori.includes(giocatoreId)) {
      return next(new AppError('Il giocatore non è nella rosa', 400));
    }

    await squadra.rimuoviGiocatore(giocatoreId);

    logger.info(`Giocatore rimosso dalla rosa: ${giocatoreId}`);
    res.status(200).json({
      status: 'success',
      message: 'Giocatore rimosso dalla rosa con successo'
    });
  } catch (error) {
    next(error);
  }
};

// Ottieni statistiche della rosa
exports.getStatistiche = async (req, res, next) => {
  try {
    const squadra = await Squadra.findOne().populate('giocatori');
    if (!squadra) {
      return next(new AppError('Nessuna squadra trovata', 404));
    }

    const statistiche = {
      numeroGiocatori: squadra.numeroGiocatori,
      giocatoriPerRuolo: squadra.giocatoriPerRuolo,
      totaleGol: squadra.giocatori.reduce((acc, g) => acc + (g.gol || 0), 0),
      totaleAssist: squadra.giocatori.reduce((acc, g) => acc + (g.assist || 0), 0),
      totaleCartelliniGialli: squadra.giocatori.reduce((acc, g) => acc + (g.cartelliniGialli || 0), 0),
      totaleCartelliniRossi: squadra.giocatori.reduce((acc, g) => acc + (g.cartelliniRossi || 0), 0)
    };

    res.status(200).json({
      status: 'success',
      data: {
        statistiche
      }
    });
  } catch (error) {
    next(error);
  }
}; 