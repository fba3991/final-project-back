import express from "express";
import Squadra from "../models/squadra.js";
import Player from "../models/player.js";

const router = express.Router();

// Rotta per ottenere la rosa della squadra
router.get('/rosa', async (req, res) => {
  try {
    // Cerca la prima squadra disponibile o crea una di default
    let squadra = await Squadra.findOne().populate('giocatori');
    
    if (!squadra) {
      // Se non esiste una squadra, crea una di default
      squadra = new Squadra({
        nome: "La Nostra Squadra",
        annoFondazione: 2024,
        citta: "Milano",
        stadio: "Stadio Comunale",
        allenatore: "Mister Rossi"
      });
      await squadra.save();
    }

    // Popola i giocatori se non sono già popolati
    if (!squadra.giocatori || squadra.giocatori.length === 0) {
      const giocatori = await Player.find();
      squadra.giocatori = giocatori.map(g => g._id);
      await squadra.save();
      squadra = await Squadra.findById(squadra._id).populate('giocatori');
    }

    res.json(squadra);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Rotta per ottenere le statistiche della squadra
router.get('/statistiche', async (req, res) => {
  try {
    const giocatori = await Player.find();
    
    if (giocatori.length === 0) {
      return res.json({
        numeroGiocatori: 0,
        totaleGol: 0,
        totaleAssist: 0,
        totaleCartelliniGialli: 0,
        totaleCartelliniRossi: 0,
        giocatoriPerRuolo: {
          portieri: 0,
          difensori: 0,
          centrocampisti: 0,
          attaccanti: 0
        }
      });
    }

    const statistiche = {
      numeroGiocatori: giocatori.length,
      totaleGol: giocatori.reduce((sum, g) => sum + (g.gol || 0), 0),
      totaleAssist: giocatori.reduce((sum, g) => sum + (g.assist || 0), 0),
      totaleCartelliniGialli: giocatori.reduce((sum, g) => sum + (g.ammonizioni || 0), 0),
      totaleCartelliniRossi: giocatori.reduce((sum, g) => sum + (g.espulsioni || 0), 0),
      giocatoriPerRuolo: {
        portieri: giocatori.filter(g => g.ruolo === 'P').length,
        difensori: giocatori.filter(g => g.ruolo === 'D').length,
        centrocampisti: giocatori.filter(g => g.ruolo === 'C').length,
        attaccanti: giocatori.filter(g => g.ruolo === 'A').length
      }
    };

    res.json(statistiche);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Rotta per creare/aggiornare la squadra
router.post('/', async (req, res) => {
  try {
    const { nome, annoFondazione, citta, stadio, allenatore } = req.body;
    
    if (!nome || !annoFondazione || !citta) {
      return res.status(400).send('Nome, anno di fondazione e città sono obbligatori');
    }

    let squadra = await Squadra.findOne();
    
    if (squadra) {
      // Aggiorna la squadra esistente
      squadra.nome = nome;
      squadra.annoFondazione = annoFondazione;
      squadra.citta = citta;
      if (stadio) squadra.stadio = stadio;
      if (allenatore) squadra.allenatore = allenatore;
    } else {
      // Crea una nuova squadra
      squadra = new Squadra({
        nome,
        annoFondazione,
        citta,
        stadio,
        allenatore
      });
    }

    await squadra.save();
    res.status(201).json(squadra);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
