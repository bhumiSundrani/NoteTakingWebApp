const validator = require('validator')
const User = require('../models/user.model')

const validateSignUp = async (req, res, next) => {
    const {firstName, lastName, email, password} = req.body
    if(!firstName || !email || !password){
        return res.status(400).json({error: "All fields are required"})
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({error: "Invalid input format"})
    }

    const dulpicateUser = await User.findOne({email})
    if(dulpicateUser){
        return res.status(400).json({error: "Email is already registered"})
    }

    next()
}

module.exports = validateSignUp