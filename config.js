export const config = {
  PORT: process.env.EXPRESS_PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/calcio",
  CORS_ORIGINS: [
    "http://localhost:5173",
    "https://final-project-front-mu.vercel.app",
  ]
};
