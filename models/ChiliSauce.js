const mongoose = require("mongoose");

//Schéma pour les sauces piquantes
const chiliSauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], require: true, default: 0 },
  usersDisliked: { type: [String], require: true, default: 0 },
});

const HotSauces = mongoose.model("ChiliSauce", chiliSauceSchema);
module.exports = { HotSauces };
