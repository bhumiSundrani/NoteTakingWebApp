const jwt = require('jsonwebtoken')
require('dotenv').config()

const TOKEN_EXPIRY = '7d'
const secret = process.env.SECRET

if (!secret) {
    console.error('JWT secret is not configured')
    process.exit(1)
}

const createToken = (user) => {
    if(!user || !user._id || !user.email) {
        throw new Error('Invalid user data for token creation')
    }

    const payload = {
        id: user._id,
        email: user.email
    }

    try {
        return jwt.sign(payload, secret, {
            expiresIn: TOKEN_EXPIRY
        })
    } catch (error) {
        console.error('Token creation error:', error)
        throw new Error('Failed to create authentication token')
    }
}

const verifyToken = (token) => {
    if(!token) {
        throw new Error('No token provided')
    }

    try {
        return jwt.verify(token, secret)
    } catch (error) {
        console.error('Token verification error:', error)
        throw error
    }
}

module.exports = {
    createToken,
    verifyToken
}