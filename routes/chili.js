const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const ctrlChili = require("../controllers/chili");

router.get("/", auth, ctrlChili.createSauce);
