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
app.use(cors({
    origin: ["https://note-taking-web-app-self.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(cookieParser())

//connect to mongoDb
createMongoDbConnection(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected successfully"))
.catch((error) => {
    console.error("Couldn't connect to MongoDb: ", error)
    process.exit(1)
})

//routers
app.use('/user', userRouter)
app.use('/notes', noteRouter)

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})

//app listening
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`)
}).on('error', (error) => {
    console.error("Cannot connect to the server: ", error)
    process.exit(1)
})