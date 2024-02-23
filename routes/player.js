
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
    try { // Verifica  i campi obbligatori sono presenti nella richiesta
      const { nome, cognome, dataNascita, nazionalita, posizione } = req.body;
     
      if (!nome || !cognome || !dataNascita || !nazionalita || !posizione) {
        return res.status(400).send('Tutti i campi obbligatori devono essere presenti');
      }
  
      const playerToCreate = req.body;// creazione nuovo giocatore con i dati dalla richiesta
      const player = new Player(playerToCreate);//salvo il giocatore creato
      await player.save();
      res.status(201).send(player);//invia il giocatore creato
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// Rotta per l'aggiornamento di un giocatore esistente
router.put('/:id', async (req, res) => {
    try {
      const playerToUpdate = req.body;
        // Trova e aggiorna il giocatore con l'ID specifico
      const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, playerToUpdate, { new: true });
  
      if (!updatedPlayer) {
        return res.status(404).send('Giocatore non trovato'); // errore se il giocatore non viene trovato
      }
  
      res.send(updatedPlayer);//giocatore aggiornato
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// Rotta per l'eliminazione di un giocatore

router.delete('/:id', async (req, res) => {
    try { // trova il giocatore da cancellare con ID
      const player = await Player.findById(req.params.id);
  
      if (!player) {
        return res.status(404).send('Giocatore non trovato');
      }
  
      await Player.findByIdAndDelete(req.params.id);//elimiono il giocatore 
      res.status(204).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  export default router;;

  