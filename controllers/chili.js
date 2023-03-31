const chiliSauce = require("../models/ChiliSauce");

exports.createSauce = (req, res, next) => {
  const chiliSauceObject = JSON.parse(req.body.thing);
  delete chiliSauceObject._id;
  delete chiliSauceObject._userId;
  const chiliSauce = new chiliSauce({
    ...chiliSauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  thing
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
