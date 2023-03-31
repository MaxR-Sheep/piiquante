const { HotSauces } = require("../models/ChiliSauce");
const fs = require("fs"); //fs pour le systeme des fichier pour modifier ou supprimer une sauce

//fonction pour la création d'un sauce piquante
exports.createSauce = (req, res, next) => {
  const chiliSauceObject = JSON.parse(req.body.sauce);
  const sauce = new HotSauces({
    ...chiliSauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce Hot enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//fonction pour un tuilisateur il peut modifier sa sauce
exports.modifySauce = (req, res, next) => {
  const chiliSauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete chiliSauceObject._userId;
  HotSauces.findOne({ _id: req.params.id })
    .then((chiliSauce) => {
      if (chiliSauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non authorisé" });
      } else {
        HotSauces.updateOne(
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

//fonction pour voir toutes les sauces
exports.getAllSauces = (req, res, next) => {
  HotSauces.find()
    .then((chiliSauce) => {
      res.status(200).json(chiliSauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//fonction pour voir une sauce
exports.getOneSauce = (req, res, next) => {
  const { id } = req.params;
  HotSauces.findById(id)
    .then((chiliSauce) => {
      res.status(200).json(chiliSauce);
    })
    .catch((error) => {
      res.status(404).json({
        error,
      });
    });
};

//fonction pour supprimer une sauce (pour l'utilisateur)
exports.deleteSauce = (req, res, next) => {
  const { id } = req.params;
  HotSauces.findById(id)
    .then((chiliSauce) => {
      if (chiliSauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non authorisé" });
      } else {
        const filename = chiliSauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          HotSauces.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//Likes/Dislikes une sauce
exports.likeSauce = (req, res, next) => {
  const { id } = req.params;
  HotSauces.findById(id).then((sauce) => {
    switch (req.body.like) {
      case 1:
        if (!sauce.usersLiked.includes(req.body.userId)) {
          sauce.likes++;
          sauce.usersLiked.push(req.body.userId);
        }
        break;
      case 0:
        if (sauce.usersLiked.includes(req.body.userId)) {
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId, 1));
          sauce.likes--;
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(
            sauce.usersLiked.indexOf(req.body.userId, 1)
          );
        }
        break;
      case -1:
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          sauce.dislikes++;
          sauce.usersDisliked.push(req.body.userId);
        }
        break;
      default:
        break;
    }
    sauce
      .save()
      .then(() =>
        res.status(200).json({ message: "Votre avis a bien été ajouté!" })
      )
      .catch((error) => res.status(400).json({ error }));
  });
};
