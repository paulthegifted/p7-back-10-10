require("dotenv").config()
//import mongoose, solution simple, basée sur des schémas, pour modéliser les données de vos applications.
const mongoose = require("mongoose")
//import mongoose unique validator, plugin verifiant l'unicité d'un schema
const uniqueValidator = require("mongoose-unique-validator")


const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const uri = `mongodb+srv://${username}:${password}@cluster1.d0bplgy.mongodb.net/?retryWrites=true&w=majority`

//connection a la base de donnée mongoDB
mongoose
  .connect(uri)
  .then(() => console.log("Connected to Mongo!"))
  .catch((err) => console.error("Error connecting to Mongo: ", err))

//exportation mongoose et user
module.exports = { mongoose }