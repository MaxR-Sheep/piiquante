const bcrypt = require("bcrypt"); // package de chiffrement pour sécurisé le mot de passe
const jsonWebToken = require("jsonwebtoken"); // un  token d'authentification pour permettre à l'utilisateur de se connecter une seule fois à son compte
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");

const secret = process.env.JWT_SECRET;

//fonction pour enregistrement utilisateur
exports.signup = (req, res, next) => {
  User.findOne({ email: req.body.email }) // utilisation du findone par rapport à l'adresse mail car soucis avec unique validator
    .then((user) => {
      if (user) {
        return res.status(300).json({ error: "Adresse mail déjà utiliser" });
      } else {
        bcrypt
          .hash(req.body.password, 10) // hachage pour sécurisé le mot de passe
          .then((hash) => {
            const user = new User({
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then(() =>
                res.status(201).json({ message: "Utilisateur créé !" })
              )
              .catch((error) => res.status(400).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(501).json({ error }));
};

// fonction pour le login utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Identifiant/E-mail incorrect" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: jsonWebToken.sign({ userId: user._id }, secret, {
              //.sign permet de chiffrer un nouveau token
              expiresIn: 5 * 60, //durée de validité du token
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(501).json({ error }));
};
