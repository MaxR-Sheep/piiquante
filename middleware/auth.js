const jwt = require("jsonwebtoken"); // token qui permet aux utilisateur de se connecter 1 seule fois
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //Nous utilisons la fonction split qui divise la chaine de caractere en un tableau nous récuperons le deuxieme.
    const decodedToken = jwt.verify(token, secret); //.verifiy permet de décodé le token , s'il n'est pas valide il y aura une erreur
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
