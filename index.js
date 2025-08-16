import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import playerRoutes from "./routes/player.js";
import squadraRoutes from "./routes/squadra.js";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config.js";

// variabili d'ambiente
dotenv.config();

const app = express();

// cors per permettere al front di funzionare
app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/player', playerRoutes);
app.use('/api/squadra', squadraRoutes);

// Connessione al database MongoDB locale
mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${config.MONGO_URI}`);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Avvio server
app.listen(config.PORT, () => {
  console.log(`Server started on port ${config.PORT}`);
});


