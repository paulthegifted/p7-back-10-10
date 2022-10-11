const { default: mongoose } = require("mongoose")
const { unlink } = require("fs/promises")
const { Product } = require("../models/postschema")

  //récuperation posts
  function getposts(req, res) {
    Product.find({})
      .then((products) => res.send(products))
      .catch((error) => res.status(500).send(error))
  }
  
  //recuperation posts par id
  function getpostsById (req, res) {
    const id = req.params.id
    Product.findById(id)
    .then(product =>res.send(product))
    .catch(console.error)
  }

  //supprimer post
  function deletepost(req, res) {
    const { id } = req.params
    Product.findByIdAndDelete(id)
      .then((product) => sendClientResponse(product, res))
      .then((item) => imageDelete(item))
      .then((res) => console.log("FILE DELETED", res))
      .catch((err) => res.status(500).send({ message: err }))
  }

  //modification post
  function modifpost(req, res) {
    const {
      params: { id }
    } = req
  
    const hasNewImage = req.file != null
    const payload = makePayload(hasNewImage, req)
  
    Product.findByIdAndUpdate(id, payload)
      .then((dbResponse) => sendClientResponse(dbResponse, res))
      .then((product) => imageDelete(product))
      .then((res) => console.log("FILE DELETED", res))
      .catch((err) => console.error("PROBLEM UPDATING", err))
  }

  //supprimer image
  function imageDelete(product) {
    if (product == null) return
    console.log("DELETE IMAGE", product)
    const imageToDelete = product.imageUrl.split("/").at(-1)
    return unlink("images/" + imageToDelete)
  }
 
  //payload
  function makePayload(hasNewImage, req) {
    console.log("hasNewImage:", hasNewImage)
    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.post)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    console.log("NOUVELLE IMAGE A GERER")
    console.log("voici le payload:", payload)
    return payload
  }
  
  //update et envoie réponse a chaque modification de la post
  function sendClientResponse(product, res) {
    if (product == null) {
      console.log("NOTHING TO UPDATE")
      return res.status(404).send({ message: "Object not found in database" })
    }
    console.log("ALL GOOD, UPDATING:", product)
    return Promise.resolve(res.status(200).send(product)).then(() => product)
  }
  
  //creation url image 
  function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
  }
  
  // fonction gerant la creation de post
  function createpost(req, res) {
    const { body, file } = req
    console.log({ file })
    const { fileName } = file
    const post = JSON.parse(body.post)
    const {name, email, description, userId } = post 

    //creation produit en suivant le schema product
    const product = new Product({
      userId: userId,
      name: name,
      email: email,
      description: description,
      imageUrl: makeImageUrl(req, fileName),
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    })
    product
      .save()
      .then((message) => {
        return res.status(201).send({ message })
      })
      .catch((err) => res.status(500).send(err))
  }

  // fonction gerant like et dislike
  function likepost(req, res) {
    const id = req.params.id
    const { userId, like} = req.body
    // si like different de 1/0/-1 alors arret fonction +err
    if (![1, -1, 0].includes(like)) return res.status(403).send({ message: "Invalid like value" })
    // sinon 
    Product.findById(id)
    // une fois produit recu depuis la base de donnée, updateVote dessus
    .then(product => updateLike(product, like, userId, res))
    //return du produit et save de celui ci apres incrementVote ou resetVote
    .then((pr) => pr.save())
    //update du produit
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err))
}

function updateLike(product, like, userId, res) {
  // si like ou dislike alors appel incrementevote
  if (like === 1 || like === -1) return incrementLike(product, userId, like)
  // sinon appel resetVote (quand annulation like ou dislike)
  return resetLike(product, userId, res)
}

// fonction annulation like ou dislike
function resetLike(product, userId, res) {
  const { usersLiked, usersDisliked } = product
  // si pour chacune de ces arrays userId est trouvé alors return : 
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject("User seems to have voted both ways")

    // si userID n'est trouvé dans aucune de ces arrays alors return : 
  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject("User seems to not have voted")

    //si user trouvé dans like
  if (usersLiked.includes(userId)) {
    //like -1
    --product.likes 
    product.usersLiked = product.usersLiked.filter((id) => id !== userId)
    //si user trouvé dans dislike
  } else {
    //dislike -1
    --product.dislikes
    product.usersDisliked = product.usersDisliked.filter((id) => id !== userId)
  }
  return product
}

// fonction like ou dislike
function incrementLike(product, userId, like) {
  const { usersLiked, usersDisliked } = product

  // votersArray = a, si like on push dans usersLiked sinon on push dans usersDisliked
  const votersArray = like === 1 ? usersLiked : usersDisliked
  // si usersId deja dans le array alors on ne fait rien (a deja voté)
  if (votersArray.includes(userId)) return product
  // sinon on push l'id dans l'array
  votersArray.push(userId)

  // est ce que like =1, si oui alors like +1 sinon dislike
  like === 1 ? ++product.likes : ++product.dislikes
  return product
}

  module.exports = { getposts, createpost,  getpostsById,  deletepost,  modifpost, sendClientResponse, likepost }