const express = require("express"); //framework Express pour simplifier serveur Node
const mongoose = require("mongoose"); // utilisation mongoDB , NoSQL base de donnée

const userRoutes = require("./routes/user");

mongoose //configuration mongoDB Atlas
  .connect(
    "mongodb+srv://maxronjat:Bzdn5dA6FnFzA9Xt@maxsheep.zyaycrl.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//
const app = express();
app.use(express.json());

//CORS= partage des ressources, permet de sécurisédes données entre 2 port differents(4200/3000)
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

module.exports = app;
