const express = require("express"); //framework Express pour simplifier serveur Node
const mongoose = require("mongoose"); // utilisation mongoDB , NoSQL base de donnée
const dotenv = require("dotenv"); // utilisation de la fonction dotenv pour sécuriser les éléments
dotenv.config();
const path = require("path");

// constante pour Mongodb qui est placé en .env (pour sécurisé)
const mongoDB = process.env.MONGO;

//Utilisations des routes de l'app
const userRoutes = require("./routes/user");
const sauceChiliRoutes = require("./routes/sauces");

mongoose //configuration mongoDB Atlas
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Express au format Json
const app = express();
app.use(express.json());

//CORS= partage des ressources, permet de sécurisé les données entre 2 port differents(4200/3000)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Toutes les routes attendu par le frontend
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceChiliRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
