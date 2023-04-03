const express = require("express");
const router = express.Router(); //creation du routeur avec express
const userCtrl = require("../controllers/user");

//Route pour les utilisateurs
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
