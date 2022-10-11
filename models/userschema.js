//import mongoose, solution simple, basée sur des schémas, pour modéliser les données de vos applications.
const mongoose = require("mongoose")
//import mongoose unique validator, plugin verifiant l'unicité d'un schema
const uniqueValidator = require("mongoose-unique-validator")

  //schema user
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  })
  //verification unicité schema 
  userSchema.plugin(uniqueValidator)
  //creattion user avec le schema
  const User = mongoose.model("User", userSchema)

  module.exports = { User }