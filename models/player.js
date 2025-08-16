import mongoose from "mongoose";
import dayjs from "dayjs";

const { Schema, model } = mongoose;

const playerSchema = new Schema({
  nome: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
    trim: true,
  },
  cognome: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
    trim: true,
  },
  dataNascita: {
    type: Date,
    required: true,
    max: () => {
      // Restituisce la data massima di 15 anni fa
      const now = dayjs();
      const fifteenYearsAgo = now.subtract(15, "years");
      return fifteenYearsAgo.format("YYYY-MM-DD");
    },
  },
  nazionalita: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
    trim: true,
  },
  ruolo: {
    type: String,
    required: true,
    enum: ['P', 'D', 'C', 'A'], // Portiere, Difensore, Centrocampista, Attaccante
  },
  squadra: {
    type: String,
    required: true,
    trim: true,
  },
  quotazione: {
    type: Number,
    required: true,
    min: 1,
    max: 1000000,
  },
  gol: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  assist: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  ammonizioni: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  espulsioni: {
    type: Number,
    default: 0,
    min: 0,
    max: 50,
  },
}, {
  timestamps: true
});

// Creazione del modello Player basato sullo schema definito
const Player = model("Player", playerSchema);

export default Player;
