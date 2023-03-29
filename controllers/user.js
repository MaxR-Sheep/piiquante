const bcrypt = require("bcrypt"); // package de chiffrement pour sécurisé le mot de passe

const User = require("../models/User");

exports.signup = (req, res, next) => {
  //fonction pour enregistrement utilisateur
  bcrypt
    .hash(req.body.password, 10) // hachage pour sécurisé le mot de passe
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  // fonction pour le login utilisateur
};
