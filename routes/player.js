
import express from "express";
import Player from "../models/player.js";

const router = express.Router();

// Rotta per la lettura di tutti i giocatori
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().select("-__v");
    res.send(players);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Rotta per la lettura di un singolo giocatore tramite ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) { 
      res.status(404).send('Giocatore non trovato');
    } else {
      res.send(player);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Rotta per la creazione di un nuovo giocatore
router.post('/', async (req, res) => {
  try {
    const { nome, cognome, dataNascita, nazionalita, ruolo, squadra, quotazione } = req.body;
   
    if (!nome || !cognome || !dataNascita || !nazionalita || !ruolo || !squadra || !quotazione) {
      return res.status(400).send('Tutti i campi obbligatori devono essere presenti');
    }

    const player = new Player(req.body);
    await player.save();
    res.status(201).send(player);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Rotta per l'aggiornamento di un giocatore esistente
router.put('/:id', async (req, res) => {
  try {
    const playerToUpdate = req.body;
    
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id, 
      playerToUpdate, 
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedPlayer) {
      return res.status(404).send('Giocatore non trovato');
    }

    res.send(updatedPlayer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Rotta per l'eliminazione di un giocatore
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).send('Giocatore non trovato');
    }

    await Player.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;

  