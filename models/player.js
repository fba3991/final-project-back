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
  posizione: {
    type: String,
    required: true,
  },
  gol: {
    type: Number,
    default: 0,
    required: true,
  },
  golSubiti: {
    type: Number,
    default: 0,
    required: true,
  },
  assist: {
    type: Number,
    default: 0,
    required: true,
  },
  ammonizioni: {
    type: Number,
    default: 0,
    required: true,
  },
  espulsioni: {
    type: Number,
    default: 0,
    required: true,
  },

  partiteGiocate: {
    type: Number,
    default: 0,
    required: true,
  },

  
});
// Creazione del modello Player basato sullo schema definito
const Player = model("Player", playerSchema);

export default Player;
