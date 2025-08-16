const express = require('express');
const router = express.Router();
const squadraController = require('../controllers/squadraController');

// Rotte per la gestione della squadra
router.post('/', squadraController.createSquadra);
router.get('/rosa', squadraController.getRosa);
router.get('/statistiche', squadraController.getStatistiche);
router.post('/giocatori/:giocatoreId', squadraController.aggiungiGiocatore);
router.delete('/giocatori/:giocatoreId', squadraController.rimuoviGiocatore);

module.exports = router; 