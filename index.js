const port = 3000
const path = require("path")
const {app, express} = require("./server")

//connection to database
require("./mongo")

//Controllers
const { createUser, logUser } = require("./controllers/users")
const { getposts, createpost,  getpostsById,  deletepost,  modifpost, likepost } = require("./controllers/posts")

//Middleware
const {upload} = require ("./middleware/multer")
const { authenticateUser } = require("./middleware/auth")

//routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/posts", authenticateUser, getposts)
app.post("/api/posts", authenticateUser , upload.single("image"), createpost)
app.get("/api/posts/:id", authenticateUser, getpostsById)
app.delete("/api/posts/:id", authenticateUser, deletepost)
app.put("/api/posts/:id", authenticateUser, upload.single("image"), modifpost)
app.get("/", (req, res) => res.send("Hello World"))
app.post("/api/posts/:id/like", authenticateUser, likepost)

//Listen 
app.use("/images",  express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("Listening on port ", +port))