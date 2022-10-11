const { default: mongoose } = require("mongoose")

// schema de chaque post
const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  description: String,
  imageUrl: String, required: false,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String]
})
const Product = mongoose.model("Product", productSchema)

module.exports = { Product }