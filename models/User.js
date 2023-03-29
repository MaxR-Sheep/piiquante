const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // package pour que notre adresse mail soit a chaque fois unique pour chaque utilisateur

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
