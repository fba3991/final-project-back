import mongoose from "mongoose";

const { Schema, model } = mongoose;

const squadraSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  annoFondazione: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear(),
  },
  citta: {
    type: String,
    required: true,
    trim: true,
  },
  stadio: {
    type: String,
    trim: true,
  },
  allenatore: {
    type: String,
    trim: true,
  },
  giocatori: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }]
}, {
  timestamps: true
});

const Squadra = model("Squadra", squadraSchema);

export default Squadra;
