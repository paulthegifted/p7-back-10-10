//import du middleware multer, utilisé pour les uploads de fichiers
const multer = require("multer")

//declaration du dossier image
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, makeFilename(req, file))
  }
})

//nom des images 
function makeFilename(req, file) {
  console.log("req, file:", file)
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
  file.fileName = fileName
  return fileName
}
const upload = multer({ storage })

// exports de upload
module.exports = {upload}