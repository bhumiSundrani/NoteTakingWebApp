const User = require("../models/user.model")
const { createToken, verifyToken } = require("../service/auth.service")

const handleUserSignup = async (req, res) => {
    if(!req.body) return res.status(400).json("User data not found")
    const {firstName, lastName, email, password} = req.body
    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        })

        const token = createToken(user)
        res.user = user
        return res.cookie("token", token).status(201).json({success: "User created successfully", user: user})
    } catch (error) {
        console.error("Signup Error: ", error);
        return res.status(500).json({error: "Cannot create User, Internal server error"})
    }
}

const handleUserLogin = async (req, res) => {
    if(!req.body) return res.status(400).json({error: "User data not found"})
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({error: "Invalid email"})
        const isMatch = await user.isPasswordCorrect(password)
        if(!isMatch) return res.status(401).json({error: "Incorrect Password"})
        const token = createToken(user)
        res.user = user
        return res.cookie("token", token).status(201).json({success: "User logged in successfully", user: user})
    } catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({error: "Cannot login User, Internal server error"})
    }
}

const handleUserSignout = async (req, res) => {
    try {
        res.clearCookie('token')
        return res.status(200).json({success: "User logged out successfully"})
    } catch (error) {
        console.error("Logout error: ", error)
        return res.status(500).json({error: "Cannot logout user, Internal server error"})
    }
}

const handleGetCurrentUser = async (req, res) => {
    const token = req.cookies.token
    if(!token) return res.status(404).json({error: "Unauthorized user"})
    const {id} = verifyToken(token)
    try {
        const user = await User.findById(id)
        return res.status(200).json({success: "User found", user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error getting user"})
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserSignout,
    handleGetCurrentUser
}