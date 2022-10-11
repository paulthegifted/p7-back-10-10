//importation jswonwebtoken, utilisé pour les transferts d'objets json sécurisé 
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwtpassword = process.env.JWT_PASSWORD

//fonction d'authentification de l'user
function authenticateUser(req, res, next) {
  console.log("authenticate user")
  const header = req.header("Authorization")
  if (header == null) return res.status(403).send({ message: "Invalid" })

  const token = header.split(" ")[1]
  if (token == null) return res.status(403).send({ message: "Token cannot be null" })

  jwt.verify(token, jwtpassword , (err, decoded) => {
    if (err) return res.status(403).send({ message: "Token invalid " + err })
    console.log("Le token est bien valide, on continue")
    next()
  })
}

module.exports = { authenticateUser }