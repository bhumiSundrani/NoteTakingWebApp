const User = require("../models/user.model")
const { createToken, verifyToken } = require("../service/auth.service")

const handleUserSignup = async (req, res) => {
    if(!req.body) return res.status(400).json({error: "User data is required"})
    const {firstName, lastName, email, password} = req.body
    try {
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(409).json({error: "Email already registered"})
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        })

        const token = createToken(user)
        if(!token) {
            return res.status(500).json({error: "Failed to create authentication token"})
        }

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(201).json({
            success: "User created successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Signup Error: ", error);
        return res.status(500).json({error: "Failed to create user account"})
    }
}

const handleUserLogin = async (req, res) => {
    if(!req.body) return res.status(400).json({error: "Login credentials are required"})
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({error: "Invalid email or password"})
        
        const isMatch = await user.isPasswordCorrect(password)
        if(!isMatch) return res.status(401).json({error: "Invalid email or password"})
        
        const token = createToken(user)
        if(!token) {
            return res.status(500).json({error: "Failed to create authentication token"})
        }

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(200).json({
            success: "Login successful",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({error: "Failed to process login request"})
    }
}

const handleUserSignout = async (req, res) => {
    try {
        return res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        }).status(200).json({success: "Logged out successfully"})
    } catch (error) {
        console.error("Logout error: ", error)
        return res.status(500).json({error: "Failed to process logout request"})
    }
}

const handleGetCurrentUser = async (req, res) => {
    const token = req.cookies.token
    if(!token) return res.status(401).json({error: "Authentication required"})
    
    try {
        const decoded = verifyToken(token)
        if(!decoded || !decoded.id) {
            return res.status(401).json({error: "Invalid authentication token"})
        }

        const user = await User.findById(decoded.id)
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }

        return res.status(200).json({
            success: "User found",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Get current user error: ", error)
        if(error.name === 'JsonWebTokenError') {
            return res.status(401).json({error: "Invalid authentication token"})
        }
        return res.status(500).json({error: "Failed to retrieve user information"})
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserSignout,
    handleGetCurrentUser
}