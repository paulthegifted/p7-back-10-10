//importation module .env
require("dotenv").config()
//importation express
const express = require("express")
const app = express()
const cors = require("cors")

//middleware
app.use(cors())
app.use(express.json())

module.exports = { app, express }