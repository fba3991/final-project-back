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

// Connessione al database MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`Connected to MongoDB`);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
} else {
  console.log('MONGODB_URI not configured, skipping database connection');
}

// Per Vercel, esportiamo l'app invece di fare listen
export default app;


