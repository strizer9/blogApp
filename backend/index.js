
const express = require("express")
const app = express()
require('dotenv').config();
const mongoose = require("mongoose")
const serverless = require("serverless-http");

const multer = require("multer")
const path = require("path")


const authRoute = require("./routes/auth")
const authUser = require("./routes/user")
const authPost = require("./routes/posts")
const authCat = require("./routes/categories")



app.use(express.json())

app.use("/images", express.static(path.join(__dirname, "/images")))

console.log(process.env.CONNECTION_URL)
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err))

const storage = multer.diskStorage({
  destination: (req, file, callb) => {
    callb(null, "images")
  },
  filename: (req, file, callb) => {
    //callb(null, "file.png")
    callb(null, req.body.name)
  },
})
const upload = multer({ storage: storage })
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded")
})


app.use("/auth", authRoute)
app.use("/users", authUser)
app.use("/posts", authPost)
app.use("/category", authCat)


// app.listen("5000", () => {
//   console.log("backend running...")
// })

module.exports.app = app
module.exports.handler = serverless(app);