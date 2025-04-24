const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET

const createToken = (user) => {
    if(!user) {
        console.log("User not provided")
        return
    }

    const payload = {
        id: user._id,
        email: user.email
    }

    return jwt.sign(payload, secret, {
        expiresIn: "7d"
    })
}

const verifyToken = (token) => {
    if(!token){
        console.log("Token not provided")
        return
    }

    return jwt.verify(token, secret)
}

module.exports = {
    createToken,
    verifyToken
}