const mongoose = require('mongoose');

const squadraSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome della squadra è obbligatorio'],
    unique: true,
    trim: true
  },
  annoFondazione: {
    type: Number,
    required: [true, "L'anno di fondazione è obbligatorio"]
  },
  giocatori: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual per ottenere il numero totale di giocatori
squadraSchema.virtual('numeroGiocatori').get(function() {
  return this.giocatori.length;
});

// Virtual per ottenere i giocatori per ruolo
squadraSchema.virtual('giocatoriPerRuolo').get(function() {
  return {
    portieri: this.giocatori.filter(g => g.ruolo === 'portiere').length,
    difensori: this.giocatori.filter(g => g.ruolo === 'difensore').length,
    centrocampisti: this.giocatori.filter(g => g.ruolo === 'centrocampista').length,
    attaccanti: this.giocatori.filter(g => g.ruolo === 'attaccante').length
  };
});

// Middleware pre-save per aggiornare updatedAt
squadraSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Metodo per aggiungere un giocatore alla rosa
squadraSchema.methods.aggiungiGiocatore = async function(giocatoreId) {
  if (!this.giocatori.includes(giocatoreId)) {
    this.giocatori.push(giocatoreId);
    await this.save();
  }
  return this;
};

// Metodo per rimuovere un giocatore dalla rosa
squadraSchema.methods.rimuoviGiocatore = async function(giocatoreId) {
  this.giocatori = this.giocatori.filter(id => id.toString() !== giocatoreId.toString());
  await this.save();
  return this;
};

const Squadra = mongoose.model('Squadra', squadraSchema);

module.exports = Squadra; 