const chiliSauce = require("../models/ChiliSauce");
const fs = require("fs"); //fs pour le systeme des fichier pour modifier ou supprimer une sauce

//fonction pour la création d'un sauce piquante
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
      res.status(201).json({ message: "Sauce piiquante enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//fonction pour un tuilisateur il peut modifier sa sauce
exports.modifySauce = (req, res, next) => {
  const chiliSauceObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete chiliSauceObject._userId;
  chiliSauce
    .findOne({ _id: req.params.id })
    .then((chiliSauce) => {
      if (chiliSauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        chiliSauce
          .updateOne(
            { _id: req.params.id },
            { ...chiliSauceObject, _id: req.params.id }
          )
          .then(() => res.status(200).json({ message: "Sauce modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
