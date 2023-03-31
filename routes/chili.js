const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); //pour vérifier l'authentification
const multer = require("../middleware/multer-config"); //pour les images apres l'auth pour éviter les images non authentifier

const ctrlChili = require("../controllers/chili");

router.post("/", auth, multer, ctrlChili.createSauce); // route pour la création de sauce
router.put("/", auth, multer, ctrlChili.modifySauce); // route pour la modification d'une sauce

module.exports = router;
