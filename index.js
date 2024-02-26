import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import playersRouter from "./routes/player.js";
import mongoose from "mongoose";
import cors from "cors"

// variabile d'a,biente
dotenv.config();

const { EXPRESS_PORT, MONGO_URI } = process.env;

const app = express();

// cors per permettere al front di funzionare
app.use(cors({
  origin: [
    " http://localhost:5173 ",  "https://final-project-front-mu.vercel.app ",
  ],
 
  

  credentials: true // abilitazione delle credenziali
}));


app.use(morgan('dev'));
app.use(express.json());

app.use('/player', playersRouter);



mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.listen(EXPRESS_PORT, () => {
  console.log(`Server started on port ${EXPRESS_PORT}`);
});


