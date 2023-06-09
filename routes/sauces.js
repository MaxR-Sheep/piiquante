const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); //pour vérifier l'authentification
const multer = require("../middleware/multer-config"); //pour les images apres l'auth pour éviter les images non authentifier
const ctrlSauces = require("../controllers/sauces");

// Differentes routes pour les sauces
router.post("/", auth, multer, ctrlSauces.createSauce); // route pour la création de sauce
router.put("/:id", auth, multer, ctrlSauces.modifySauce); // route pour la modification d'une sauce
router.get("/", auth, ctrlSauces.getAllSauces); //fonction pour voir toutes les sauces
router.get("/:id", auth, ctrlSauces.getOneSauce); // fonction pour voir une sauce
router.delete("/:id", auth, ctrlSauces.deleteSauce); // fonction pour qu'un utilisateur supprime sa sauce
router.post("/:id/like", auth, ctrlSauces.likeSauce); // fonction pour likes dislikes une sauce

module.exports = router;
