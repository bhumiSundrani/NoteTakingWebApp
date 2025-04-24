const express = require('express')
const app = express()
require('dotenv').config()
const createMongoDbConnection = require('./connection/mongoose.connection')
const userRouter = require('./routers/user.route')
const cors = require('cors')
const noteRouter = require('./routers/note.route')
const cookieParser = require('cookie-parser')

//defining variables
const PORT = process.env.PORT || 9000

//using middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({origin: "https://note-taking-web-app-self.vercel.app", credentials: true}))
app.use(cookieParser())

//connect to mongoDb
createMongoDbConnection(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected successfully"))
.catch((error) => console.log("Couldn't connect to MongoDb: ", error))

//routers
app.use('/user', userRouter)
app.use('/notes', noteRouter)

//app listening
try {
    app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`))
} catch (error) {
    console.log("Cannot connect to the server: ", error)
}