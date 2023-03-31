const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const ctrlChili = require("../controllers/chili");

router.post("/", auth, multer, ctrlChili.createSauce); // route pour la création de sauce
router.put("/", auth, multer, ctrlChili.modifySauce); // route pour la modification d'une sauce
