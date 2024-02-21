import mongoose from "mongoose";


const { Schema, model } = mongoose;

const playerSchema = new Schema({
  nome: {
    type: String,
    required: true,
    
  },
  cognome: {
    type: String,
    required: true
  },
  dataNascita: {
    type: Date,
    required: true,
    
  },
  nazionalita: {
    type: String,
    required: true,

  },
  posizione: {
    type: String,
    required: true
  },
  gol: {
    type: Number,
    default: 0,
    required:true
  },
  golSubiti: {
    type: Number,
    default: 0,
    required:true
  },
  assist: {
    type: Number,
    default: 0,
    required:true
  },
  ammonizioni:{
    type:Number,
    default:0,
    required:true
  },
  espulsioni:{
    type:Number,
    default:0,
    required:true
  },

  partiteGiocate: {
    type: Number,
    default: 0,
    required:true
  },
 
  immagine: {
    type: String,
    default: ' image/GettyImages-1342834182-1637413265607-1200x675.jpg'
  },
 
 
 

});

const Player = model('Player', playerSchema);

export default Player;
