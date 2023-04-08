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
      res.status(201).json({ message: "Sauce Hot enregistrée !" });
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
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
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
  // rechercher si un schémas avec id de la sauce existe
  HotSauces.findById(id)
    .then((chiliSauce) => {
      if (chiliSauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non authorisé" });
      } else {
        const filename = chiliSauce.imageUrl.split("/images/")[1]; // const pour mettre une liste ordonné dans un tableau
        fs.unlink(`images/${filename}`, () => {
          //méthode pour supprimer dans le fichier local l'image associer à la sauce
          HotSauces.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// fonction pour Likes/Dislikes une sauce
exports.likeSauce = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  HotSauces.findById(sauceId).then((sauce) => {
    // rechercher si un schémas avec id de la sauce existe
    switch (req.body.like) {
      case 1:
        //vérifier si l'identifiant de l'utilisateur n'est pas dans le tableau des sauce like
        if (!sauce.usersLiked.includes(userId)) {
          sauce.likes++;
          sauce.usersLiked.push(userId); // on ajoute l'utilisateur au tableau
        }
        break;
      case 0:
        //vérifie si l'identifiant de l'utilisateur est dans le tableau like
        if (sauce.usersLiked.includes(userId)) {
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId, 1)); //modification du tableau
          sauce.likes--;
          // vérifier si l'identification de l'utilisateur est dans le tableau dislike
        } else if (sauce.usersDisliked.includes(userId)) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(sauce.usersLiked.indexOf(userId, 1));
        }
        break;
      case -1: //verifie si l'identifiant de l'utilisateur n'est pas dans le tableau des sauce dislike
        if (!sauce.usersDisliked.includes(userId)) {
          sauce.dislikes++;
          sauce.usersDisliked.push(userId); // on ajoute l'id au tableau dislike
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
